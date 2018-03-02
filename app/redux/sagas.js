import { StatusBar } from 'react-native';
import { takeEvery, put, call, select } from 'redux-saga/effects';
import moment from 'moment';
import _ from 'lodash';
import { REHYDRATE } from 'redux-persist/constants';
import * as api from '../lib/api';
import * as NotificationManager from '../lib/NotificationManager';
import { GET_OVERVIEW_MATCHES, OVERVIEW_MATCHES } from './modules/overview';
import {
  GET_MATCHES,
  SUGGEST_SCORE,
  INSERT_RESULTS,
  GET_MATCH,
  GET_MATCH_DONE,
  SUGGEST_DATETIME,
} from './modules/matches';
import { GET_MY_TEAM_MATCHES, MY_TEAM_MATCHES } from './modules/myteam';
import {
  GET_LEAGUES,
  GET_LEAGUE,
  GET_LEAGUE_DONE,
  GET_LEAGUE_MATCHES,
  GET_LEAGUE_MATCHES_DONE,
  GET_LEAGUE_PLAYER_STATS,
  GET_LEAGUE_PLAYER_STATS_DONE,
} from './modules/leagues';
import { LOGOUT, LOGOUT_DONE } from './modules/auth';
import * as LoadingActions from './modules/loading';
import {
  GET_TEAM,
  GET_TEAM_DONE,
  GET_TEAM_MATCHES,
  GET_TEAM_MATCHES_DONE,
} from './modules/teams';
import * as AuthActions from './modules/auth';
import * as NavigationActions from './modules/navigation';
import * as PlayerActions from './modules/player';
import * as MatchUtils from '../lib/MatchUtils';
import * as DrawerActions from './modules/drawer';
import * as SettingsActions from './modules/settings';
import Routes from '../config/routes';
import { DATETIME_DB, DATE_FORMAT } from '../config/settings';
import { getMatchDays } from '../Helper';
import { currentRoute, findRouteKey } from '../lib/NavUtils';

import {
  setFixtures,
  setFixtureData,
  setFixtureMeta,
  SET_FIXTURE_GAME_RESULT,
  getFixtureModus,
  getFixtureGame,
  getFixture,
  setFixtureDates,
  getFixtureDates,
  SUGGEST_FIXTURE_DATES,
  ACCEPT_FIXTURE_DATE,
  SUGGEST_FIXTURE_RESULT,
  ACCEPT_FIXTURE_RESULT,
} from './modules/fixtures';
import {
  userAddTeam,
  userSetApiKey,
  userSetToken,
  getActiveTeam,
} from './modules/user';

function* overview() {
  try {
    yield put(LoadingActions.show());
    const matchesData = yield call(api.getMatches);

    const data = {
      today: { data: {}, sections: [] },
      next: { data: {}, sections: [] },
      played: { data: {}, sections: [] },
    };
    const matches = [];
    const DATEFORMAT = 'YYYY-MM-DD';
    const now = moment(moment().format(DATEFORMAT), DATEFORMAT);
    const state = yield select();
    let updateDrawer = false;

    for (let match of matchesData.data) {
      if (!state.drawer[match.competitionId]) {
        updateDrawer = true;
      }
      const datetime = moment(
        moment(match.date, DATETIME_DB).format(DATEFORMAT),
        DATEFORMAT,
      );
      const diff = datetime.diff(now, 'days');
      const key = moment(match.date, DATETIME_DB).format(DATE_FORMAT);
      if (diff === 0 || match.status === 'IN_PLAY') {
        if (!data.today.data[key]) {
          data.today.data[key] = [];
          data.today.sections.push(key);
        }
        data.today.data[key].push(match.id);
      } else if (diff < 0 && match.result) {
        if (!data.played.data[key]) {
          data.played.data[key] = [];
          data.played.sections.push(key);
        }
        data.played.data[key].push(match.id);
      } else if (diff > 0) {
        if (!data.next.data[key]) {
          data.next.data[key] = [];
          data.next.sections.push(key);
        }
        data.next.data[key].push(match.id);
      }
      matches.push(match);
    }
    yield put(setFixtures(_.keyBy(matches, 'id')));
    yield sortOverview(data);

    yield put(LoadingActions.hide());
    NotificationManager.removeAllNotifications();
    if (updateDrawer) {
      const leagues = yield call(api.getLeagues);
      yield put(DrawerActions.setLeagues(_.keyBy(leagues.data, 'id')));
    }
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.hide());
    yield put(LoadingActions.error(ex.message));
  }
}

function* sortOverview(data) {
  const { matches, overview } = yield select();
  if (!data) {
    data = overview;
  }
  for (let key in data) {
    for (let date in data[key]) {
      if (data[key] && data[key].data && data[key].data[date]) {
        data[key].data[date].sort(MatchUtils.sort(matches));
      }
    }
    if (data[key] && data[key].sections) {
      data[key].sections.sort((a, b) => {
        const dateA = moment(a.substring(4), DATE_FORMAT.substring(4));
        const dateB = moment(b.substring(4), DATE_FORMAT.substring(4));

        const sort =
          key === 'next' ? dateB.isBefore(dateA) : dateA.isBefore(dateB);

        return sort ? 1 : -1;
      });
    }
  }
  yield put({ type: OVERVIEW_MATCHES, payload: data });
}

function* myTeam() {
  try {
    yield put(LoadingActions.show());
    const state = yield select();
    const team = getActiveTeam(state);
    const { data } = yield call(api.getTeamMatches, team.id);
    const payload = { next: [], played: [] };
    for (let match of data) {
      if (match.result && match.status == 'CONFIRMED') {
        payload.played.push(`${match.id}`);
      } else {
        payload.next.push(`${match.id}`);
      }
    }
    yield put(setFixtures(_.keyBy(data, 'id')));
    yield put({ type: MY_TEAM_MATCHES, payload });
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  } finally {
    yield put(LoadingActions.hide());
  }
}

function* leagues() {
  try {
    yield put(LoadingActions.show());
    const leagues = yield call(api.getLeagues);
    yield put(DrawerActions.setLeagues(leagues.data));
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  } finally {
    yield put(LoadingActions.hide());
  }
}

function* logout() {
  try {
    yield put(LoadingActions.showModal());
    yield put({ type: MY_TEAM_MATCHES, payload: { next: [], played: [] } });
    yield call(api.logout);
  } catch (ex) {
    console.warn(ex);
  } finally {
    yield put({ type: LOGOUT_DONE });
    yield put(LoadingActions.hideModal());
  }
}

function* getMatch(action) {
  try {
    yield refreshToken();
    yield put(LoadingActions.show());
    const { data, meta } = yield call(api.getMatch, action.params.id);
    yield put(setFixtureData(data));
    meta.games = _.keyBy(meta.games, 'gameNumber');
    yield put(setFixtureMeta(data.id, meta));
    yield sortOverview();
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  } finally {
    yield put(LoadingActions.hide());
  }
}

function* getLeague(action) {
  try {
    yield put(LoadingActions.show());
    const league = yield call(api.getLeague, action.payload.id);
    yield put({
      type: GET_LEAGUE_DONE,
      payload: { ...league.data, table: league.meta.leagueTable },
    });
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  } finally {
    yield put(LoadingActions.hide());
  }
}

function* getLeagueMatches(action) {
  try {
    yield put(LoadingActions.show());
    const matches = yield call(api.getLeagueMatches, action.payload.id);
    // yield put({ type: GET_MATCHES, payload: matches.meta.fixtures });
    yield put(setFixtures(_.keyBy(matches.meta.fixtures, 'id')));
    yield put({
      type: GET_LEAGUE_MATCHES_DONE,
      payload: {
        ...getMatchDays(matches.meta.fixtures),
        id: `${action.payload.id}`,
      },
    });
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  } finally {
    yield put(LoadingActions.hide());
  }
}

function* getLeaguePlayerStats(action) {
  try {
    yield put(LoadingActions.show());
    const player = yield call(api.getLeaguePlayers, action.payload.id);
    yield put({
      type: GET_LEAGUE_PLAYER_STATS_DONE,
      payload: { id: `${action.payload.id}`, players: player.data },
    });
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  } finally {
    yield put(LoadingActions.hide());
  }
}

function* getTeam(action) {
  try {
    yield put(LoadingActions.show());
    const { data, meta } = yield call(api.getTeam, action.payload.id);
    yield put({
      type: GET_TEAM_DONE,
      payload: {
        ...data,
        venue: meta.venue,
        player: meta.player,
        contact: meta.contact,
        club: meta.club,
        standing: meta.standing,
        homeFixture: meta.homeFixture,
      },
    });
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  } finally {
    yield put(LoadingActions.hide());
  }
}

function* getTeamMatches(action) {
  try {
    yield put(LoadingActions.show());
    const matches = yield call(api.getTeamMatches, action.payload.id);
    yield put({
      type: GET_MATCHES,
      payload: matches.data,
    });
    yield put({
      type: GET_TEAM_MATCHES_DONE,
      payload: {
        id: `${action.payload.id}`,
        matches: matches.data.map(m => `${m.id}`),
      },
    });
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  } finally {
    yield put(LoadingActions.hide());
  }
}

function* login(action) {
  try {
    yield put(LoadingActions.show());
    const { data } = yield call(api.authenticate, action.payload);
    const apiKey = data.token;
    // yield put(AuthActions.setApiKey(apiKey));
    yield put(userSetApiKey(apiKey));
    const { data: token } = yield call(api.refreshAuthentication, apiKey);

    yield put(userSetToken(token.token, token.accessForTeams, token.expires));
    // console.log(team);
    // yield put(
    //   AuthActions.setToken({
    //     expires: team.data.expires,
    //     token: team.data.token,
    //     ids,
    //   }),
    // );
    // const state = yield select();
    // if (state.settings.notification.on) {
    //   yield put(SettingsActions.setNotification({ matchdate: true }));
    // }
    yield put(NavigationActions.hideLogin(action.next));
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  } finally {
    yield put(LoadingActions.hide());
  }
}

function* hideLogin() {
  try {
    const state = yield select();
    const modal =
      state.nav.navigation.routes[state.nav.navigation.index].routeName;
    if (modal === Routes.MODAL_LOGIN) {
      yield put({
        type: NavigationActions.BACK,
        key: findRouteKey(state.nav.navigation, Routes.MODAL_LOGIN),
      });
      // yield put({ type: NavigationActions.OPEN_MY_TEAM });
    } else {
      yield put(NavigationActions.navigate({ routeName: 'SetupNotif' }));
    }
    if (
      state.settings.team &&
      state.myTeam.next.length === 0 &&
      state.myTeam.played.length === 0
    ) {
      yield myTeam();
    }
  } catch (ex) {
    console.warn(ex);
  }
}

function* getPlayer(action) {
  try {
    yield put(LoadingActions.show());
    const player = yield call(api.getPlayer, action.payload.id);
    yield put({ type: PlayerActions.GET_PLAYER_DONE, payload: player.data });
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  } finally {
    yield put(LoadingActions.hide());
  }
}

function* updateMatch(action) {
  try {
    const { id, sets } = action.payload;
    const state = yield select();
    const match = state.matches[id];
    const payload = [];
    for (let i in sets) {
      const set = sets[i];
      payload.push({
        home_player_1_id: set.homePlayer1 ? set.homePlayer1.id : null,
        home_player_2_id: set.homePlayer2 ? set.homePlayer2.id : null,
        away_player_1_id: set.awayPlayer1 ? set.awayPlayer1.id : null,
        away_player_2_id: set.awayPlayer2 ? set.awayPlayer2.id : null,
        goals_home: set.result ? set.result.goalsHome : null,
        goals_away: set.result ? set.result.goalsAway : null,
        key: set.key,
        game_number: set.gameNumber,
      });
    }

    const { data, meta } = yield call(api.patchFixtureGames, match, payload);
    let newMatch = {
      ...data,
      sets: _.keyBy(meta.games, 'gameNumber'),
      modus: meta.modus,
      teamHome: { player: meta.player.home },
      teamAway: { player: meta.player.away },
    };
    newMatch.isAdmin = true;
    newMatch = {
      ...newMatch,
      games: MatchUtils.sets(
        match,
        meta.modus.lineUp[meta.modus.fixtureModus || 'default'],
      ),
    };

    yield put({ type: GET_MATCH_DONE, payload: newMatch });
    yield sortOverview();
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  } finally {
    yield put(LoadingActions.hideModal());
  }
}

function* navigate(action) {
  try {
    yield put(LoadingActions.hide());
    let state = yield select();
    if (action.routeName === 'SelectGroup') {
      StatusBar.setBarStyle('light-content');
    }
    switch (action.routeName) {
      case Routes.MATCH:
        {
          yield call(getMatch, action);
          NotificationManager.removeNotification(action.params.id);
        }
        break;
      case Routes.MY_TEAM:
        if (!getActiveTeam(state)) {
          yield put(NavigationActions.showLogin());
        } else {
          yield put({ type: NavigationActions.OPEN_MY_TEAM });
          if (
            state.myTeam.next.length === 0 &&
            state.myTeam.played.length === 0
          ) {
            yield myTeam();
          }
        }
        break;
      case Routes.LEAGUE_CUP:
        if (
          !state.leagues[`${action.params.id}`] ||
          !state.leagues[`${action.params.id}`].match_days
        ) {
          yield getLeagueMatches({ payload: { id: action.params.id } });
        }
        break;
      case Routes.LEAGUE:
        {
          const id = action.params.id;
          if (!state.leagues[`${id}`] || !state.leagues[`${id}`].table) {
            yield getLeague({ payload: { id } });
          }
        }
        break;
      case Routes.TAB_PLAYER_STATS:
        {
          const id = action.params
            ? action.params.id
            : currentRoute(state.nav.navigation).params.id;
          if (!state.leagues[`${id}`] || !state.leagues[`${id}`].players) {
            yield getLeaguePlayerStats({ payload: { id } });
          }
        }
        break;
      case Routes.TAB_LEAGUE_MATCHES:
        {
          const id = action.params
            ? action.params.id
            : currentRoute(state.nav.navigation).params.id;
          if (!state.leagues[`${id}`] || !state.leagues[`${id}`].match_days) {
            yield getLeagueMatches({ payload: { id } });
          }
        }
        break;
      case Routes.TEAM:
      case Routes.TAB_TEAM:
        {
          const id = action.params
            ? action.params.team.id
            : currentRoute(state.nav.navigation).params.team.id;
          if (!state.teams[`${id}`]) {
            yield getTeam({ payload: { id } });
          }
        }
        break;
      case Routes.TAB_MATCHES:
        {
          const id = action.params
            ? action.params.team.id
            : currentRoute(state.nav.navigation).params.team.id;
          if (!state.teams[`${id}`] || !state.teams[`${id}`].matches) {
            yield getTeamMatches({ payload: { id } });
          }
        }
        break;
      case Routes.TAB_MY_TEAM_INFO:
        {
          const team = getActiveTeam(state);
          if (!state.teams[`${team.id}`]) {
            yield getTeam({ payload: { id: team.id } });
          }
        }
        break;
      case Routes.PLAYER:
        {
          const id = action.params.id;
          if (!state.players[`${id}`]) {
            yield getPlayer({ payload: { id } });
          }
        }
        break;
      case Routes.MATCH_DATE:
        {
          const id = action.params.id;
          yield getFixtureDatesSaga({ payload: { id } });
        }
        break;
    }
  } catch (ex) {
    console.warn(ex);
  }
}

function* getFixtureDatesSaga(action) {
  try {
    const { id } = action.payload;
    const state = yield select();
    const fixture = getFixture(state, id);
    const { data, meta } = yield call(api.getFixtureDates, fixture);
    yield put(setFixtureDates(id, { dates: data, meta }));
  } catch (ex) {
    console.warn(ex);
  }
}

function* updateNotifications() {
  try {
    const state = yield select();
    if (state.settings.fcm_token) {
      yield toggleNotificationSaga();
    }
  } catch (ex) {
    console.warn(ex);
  }
}

function* refreshToken() {
  try {
    const state = yield select();
    const team = getActiveTeam(state);
    if (team && team.access && team.access.tokek && team.access.apiKey) {
      if (team.access.expires < new Date().getTime()) {
        const { data } = yield call(
          api.refreshAuthentication,
          team.access.apiKey,
        );
        yield put(userSetToken(data.token, data.accessForTeams, data.expires));
        api.setAuthorization(data.token);
      } else {
        api.setAuthorization(team.access.token);
      }
    }
  } catch (ex) {
    console.warn(ex);
  }
}

function* rehydrate() {
  try {
    const state = yield select();
    if (
      _.size(state.settings.notification.leagues) === 0 &&
      _.size(state.drawer) === 0
    ) {
      yield put(
        NavigationActions.navigate({ routeName: Routes.MODAL_FIRST_START }),
      );
      const leagues = yield call(api.getLeagues);
      yield put(DrawerActions.setLeagues(_.keyBy(leagues.data, 'id')));
    } else {
      StatusBar.setBarStyle('light-content');
      // yield refreshToken();
      // const team = getActiveTeam(state);
      // if (team && team.access && team.access.token && team.access.apiKey) {

      //   if (team.access.expires < new Date().getTime()) {
      //     const { data } = yield call(api.refreshAuthentication, team.access.apiKey);
      //     yield put(userSetToken(data.token, data.accessForTeams, data.expires));
      //     api.setAuthorization(data.token);
      //   } else {
      //     api.setAuthorization(team.access.token);
      //   }
      // }
      // if (state.auth.api_key && state.auth.team) {
      //   if (state.auth.team.expires < new Date().getTime()) {
      //     yield put(LoadingActions.showModal());
      //     const team = yield call(
      //       api.refreshAuthentication,
      //       state.auth.api_key,
      //     );
      //     const ids = team.data.ids.map(item => `${item}`);
      //     yield put(
      //       AuthActions.setToken({
      //         expires: team.data.expires,
      //         token: team.data.token,
      //         ids,
      //       }),
      //     );
      //   } else {
      //     api.setAuthorization(state.auth.team.token);
      //   }
      // }
      yield overview();
    }
  } catch (ex) {
    console.warn(ex);
  } finally {
    yield put(LoadingActions.hideModal());
  }
}

function* showLogin() {
  try {
    const state = yield select();
    const team = getActiveTeam(state);
    if (team && !team.access) {
      yield put(
        NavigationActions.navigate({
          routeName: 'LoginView',
          params: { init: true },
        }),
      );
    }
  } catch (ex) {
    console.warn(ex);
  }
}

function* insertResults(action) {
  try {
    const state = yield select();
    const match = state.matches[action.payload.id];
    if (match) {
      yield put({
        type: GET_MATCH_DONE,
        payload: { ...match, games: MatchUtils.sets(match) },
      });
    }
  } catch (ex) {
    console.warn(ex);
  }
}

function* suggestDatetime(action) {
  try {
    yield put(LoadingActions.showModal());
    const match = yield call(api.updateMatch, action.payload.id, {
      datetime_suggestions: action.payload.datetime_suggestions,
    });
    yield put({ type: GET_MATCH_DONE, payload: match.data });
    yield put({ type: NavigationActions.BACK });
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  } finally {
    yield put(LoadingActions.hideModal());
  }
}

function* hideStart() {
  StatusBar.setBarStyle('light-content');
  yield put({ type: 'hideWizard' });
  yield overview();
}

function* completeSetup() {
  const state = yield select();
  if (_.size(state.settings.notification.leagues) > 0) {
    yield put(
      SettingsActions.setNotification({
        on: true,
        live: true,
        ended: true,
        matchdate: state.auth.api_key ? true : false,
      }),
    );
  }
  yield put(NavigationActions.hideStart());
}

function* checkChange(action) {
  const { loading, overview: data, nav } = yield select();
  const today = moment().format(DATE_FORMAT);
  const route = currentRoute(nav.navigation);

  if (
    route.routeName === Routes.OVERVIEW &&
    action.payload === 'active' &&
    !loading.list &&
    data.next[today]
  ) {
    yield overview();
  }
}

function* fetchUserTeam(action) {
  const { id } = action.payload;
  try {
    yield put(LoadingActions.showModal());
    const { data } = yield call(api.getTeam, id);
    yield put(userAddTeam(data));
    yield put(NavigationActions.navigate({ routeName: 'LoginView' }));
  } catch (ex) {
    console.warn(ex);
  } finally {
    yield put(LoadingActions.hideModal());
  }
}

function* setFixtureGameResultSaga(action) {
  try {
    const { payload } = action;
    const state = yield select();
    const modus = getFixtureModus(state, payload.id);
    const defaultModus =
      modus.lineUp && modus.lineUp.default ? modus.lineUp.default : null;
    const match = getFixture(state, payload.id);
    if (defaultModus != null) {
      const body = [];
      for (let item of defaultModus) {
        for (let gameNumber of item.gameNumbers) {
          const game = getFixtureGame(state, payload.id, gameNumber);
          if (game.result || (game.homePlayer1 && game.awayPlayer1)) {
            body.push({
              home_player_1_id: game.homePlayer1 ? game.homePlayer1.id : null,
              home_player_2_id: game.homePlayer2 ? game.homePlayer2.id : null,
              away_player_1_id: game.awayPlayer1 ? game.awayPlayer1.id : null,
              away_player_2_id: game.awayPlayer2 ? game.awayPlayer2.id : null,
              goals_home: game.result ? game.result.goalsHome : null,
              goals_away: game.result ? game.result.goalsAway : null,
              key: item.key,
              game_number: gameNumber,
            });
          }
        }
      }
      if (body.length > 0) {
        yield put(LoadingActions.showModal());
        if (action.type === SUGGEST_FIXTURE_RESULT) {
          const { data, meta } = yield call(api.putFixtureGames, match, body);
          yield put(setFixtureData(data));
          yield put(setFixtureMeta(data.id, meta));
        } else if (action.type === ACCEPT_FIXTURE_RESULT) {
          const { data } = yield call(api.postFixtureGames, match);
          yield put(setFixtureData(data));
        } else {
          const { data, meta } = yield call(api.patchFixtureGames, match, body);
          yield put(setFixtureData(data));
          meta.games = _.keyBy(meta.games, 'gameNumber');
          yield put(setFixtureMeta(data.id, meta));
        }
      }
    }
  } catch (ex) {
    console.warn(ex);
  } finally {
    yield put(LoadingActions.hideModal());
  }
}

function* toggleNotificationSaga() {
  try {
    const state = yield select();
    const resp = yield call(
      api.putNotification,
      SettingsActions.getFCMToken(state),
      SettingsActions.notificationEnabled(state),
      SettingsActions.notificationSound(state),
      SettingsActions.notificationInterimResults(state),
      SettingsActions.notificationFinalResults(state),
    );
    api.setFCM(resp.token);
  } catch (ex) {
    console.warn(ex);
  }
}

function* subscribeFixtureSaga(action) {
  const { fixtureId } = action.payload;
  try {
    yield call(api.postNotificationFixture, fixtureId);
  } catch (ex) {
    console.warn(ex);
  }
}

function* unsubscribeFixtureSaga(action) {
  const { fixtureId } = action.payload;
  try {
    yield call(api.deleteNotificationFixture, fixtureId);
  } catch (ex) {
    console.warn(ex);
  }
}

function* suggestFixtureDatesSaga(action) {
  try {
    yield put(LoadingActions.showModal());
    const { id } = action.payload;
    const state = yield select();
    const fixture = getFixture(state, id);
    const fixtureDates = getFixtureDates(state, id);
    const { data, meta } = yield call(
      api.putFixtureDates,
      fixture,
      fixtureDates.dates,
      fixtureDates.meta.minDates,
      fixtureDates.meta.maxDates,
    );
    yield put(setFixtureDates(id, { dates: data, meta }));
    yield put(LoadingActions.hideModal());
    yield put(NavigationActions.back());
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.hideModal());
  }
}

function* acceptFixtureDateSaga(action) {
  const { fixtureId, datetimeId } = action.payload;
  try {
    // yield put(Loading)
    const state = yield select();
    const fixture = getFixture(state, fixtureId);
    // const { data, meta } =
    yield call(api.patchFixtureDate, fixture, datetimeId);
  } catch (ex) {
    console.warn(ex);
  }
}

export default function* sagas() {
  yield takeEvery(LoadingActions.APP_STATE_CHANGED, checkChange);
  yield takeEvery(GET_OVERVIEW_MATCHES, overview);
  yield takeEvery(GET_MY_TEAM_MATCHES, myTeam);
  yield takeEvery(GET_LEAGUES, leagues);
  yield takeEvery(LOGOUT, logout);
  yield takeEvery(GET_MATCH, getMatch);
  yield takeEvery(GET_LEAGUE, getLeague);
  yield takeEvery(GET_LEAGUE_MATCHES, getLeagueMatches);
  yield takeEvery(GET_LEAGUE_PLAYER_STATS, getLeaguePlayerStats);
  yield takeEvery(GET_TEAM, getTeam);
  yield takeEvery(GET_TEAM_MATCHES, getTeamMatches);
  yield takeEvery(AuthActions.LOGIN, login);
  yield takeEvery(NavigationActions.HIDE_LOG_IN_MODAL, hideLogin);
  yield takeEvery(NavigationActions.SHOW_LOG_IN_MODAL, showLogin);
  yield takeEvery(PlayerActions.GET_PLAYER, getPlayer);
  yield takeEvery(NavigationActions.NAVIGATE, navigate);
  yield takeEvery(NavigationActions.BACK, navigate);
  yield takeEvery(REHYDRATE, rehydrate);
  yield takeEvery(SettingsActions.SET_FCM_TOKEN, updateNotifications);
  yield takeEvery(SUGGEST_SCORE, updateMatch);
  yield takeEvery(INSERT_RESULTS, insertResults);
  yield takeEvery(SUGGEST_DATETIME, suggestDatetime);
  yield takeEvery(NavigationActions.HIDE_START_MODAL, hideStart);
  yield takeEvery(SettingsActions.COMPLETE_SETUP, completeSetup);
  // yield takeEvery(SettingsActions.FETCH_USER_TEAM, fetchUserTeam);

  yield takeEvery(SET_FIXTURE_GAME_RESULT, setFixtureGameResultSaga);
  yield takeEvery(SettingsActions.TOGGLE_NOTIFICATION, toggleNotificationSaga);
  yield takeEvery(SettingsActions.SUBSCRIBE_FIXTURE, subscribeFixtureSaga);
  yield takeEvery(SettingsActions.UNSUBSCRIBE_FIXTURE, unsubscribeFixtureSaga);
  yield takeEvery(SUGGEST_FIXTURE_DATES, suggestFixtureDatesSaga);
  yield takeEvery(ACCEPT_FIXTURE_DATE, acceptFixtureDateSaga);
  yield takeEvery(SUGGEST_FIXTURE_RESULT, setFixtureGameResultSaga);
  yield takeEvery(ACCEPT_FIXTURE_RESULT, setFixtureGameResultSaga);
  yield takeEvery('SELECT_USER_TEAM', fetchUserTeam);
}
