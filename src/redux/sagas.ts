import moment from 'moment';
import { StatusBar } from 'react-native';
import { takeEvery, put, call, select } from 'redux-saga/effects';
import _ from 'lodash';
import { REHYDRATE } from 'redux-persist';
import * as api from '@app/lib/api';
import * as NotificationManager from '@app/lib/NotificationManager';
import {
  SUGGEST_SCORE,
  INSERT_RESULTS,
  GET_MATCH,
  GET_MATCH_DONE,
  SUGGEST_DATETIME,
} from './modules/matches';
import { GET_MY_TEAM_MATCHES } from './modules/myteam';
import {
  GET_LEAGUES,
  GET_LEAGUE,
  GET_LEAGUE_DONE,
  GET_LEAGUE_MATCHES,
  GET_LEAGUE_MATCHES_DONE,
  GET_LEAGUE_PLAYER_STATS,
  GET_LEAGUE_PLAYER_STATS_DONE,
} from './modules/leagues';
import * as LoadingActions from './modules/loading';
import { GET_TEAM, GET_TEAM_DONE, GET_TEAM_MATCHES } from './modules/teams';
import * as AuthActions from './modules/auth';
import * as NavigationActions from './modules/navigation';
import * as PlayerActions from './modules/player';
import * as MatchUtils from '@app/lib/MatchUtils';
import * as DrawerActions from './modules/drawer';
import * as SettingsActions from './modules/settings';
import RoutesOld from '@app/config/routes';
import { Routes } from '@app/scenes/routes';
import { getMatchDays } from '@app/helper';
import { currentRoute, findRouteKey } from '@app/lib/NavUtils';
import { DATE_FORMAT, DATETIME_DB } from '@app/config/settings';

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
  SET_FIXTURE_GAME_AWAY_PLAYER,
  getFixtureGames,
  getFixtureDefaultLineUp,
  FILTER_PASSED,
  FILTER_TODAY,
  FILTER_UPCOMMING,
  STATUS_CONFIRMED,
  STATUS_FINISHED,
  STATUS_IN_PLAY,
  STATUS_POSTPONED,
  STATUS_SCHEDUELED,
  fixtureSort,
  setOverview,
  SET_FIXTURES,
  SET_FIXTURE_DATA,
} from './modules/fixtures';
import {
  userAddTeam,
  userSetApiKey,
  userSetToken,
  getActiveTeam,
  USER_REMOVE_TEAM,
} from './modules/user';
import { QUERY_FIXTURE_OVERVIEW, QUERY_PLAYER_STATS } from './actions';

function* queryOverviewSaga() {
  try {
    yield put(LoadingActions.show());
    const matchesData = yield call(api.getMatches);
    const state = yield select();
    let updateDrawer = false;

    for (let match of matchesData.data) {
      if (!state.drawer[match.competitionId]) {
        updateDrawer = true;
        break;
      }
    }
    yield put(setFixtures(_.keyBy(matchesData.data, 'id')));
    // yield put(setOverview(overview));
    // yield overviewWrapper();
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
function* overviewWrapper() {
  const state = yield select();
  const fixtures = _.values(state.fixtures.data);
  yield put(
    setOverview({
      [FILTER_PASSED]: buildOverview(fixtures, FILTER_PASSED),
      [FILTER_TODAY]: buildOverview(fixtures, FILTER_TODAY),
      [FILTER_UPCOMMING]: buildOverview(fixtures, FILTER_UPCOMMING),
    }),
  );
}
function buildOverview(data, filter) {
  const sections = {};
  const today = moment();
  // for (let id in get(state).data) {
  for (let fixture of data) {
    // const fixture = getFixture(state, id);
    const diff =
      parseInt(today.format('YYYYMMDD')) -
      parseInt(moment(fixture.date, DATETIME_DB).format('YYYYMMDD'));
    const key = moment(fixture.date, DATETIME_DB).format(DATE_FORMAT);
    if (filter === FILTER_TODAY) {
      if (fixture.status === STATUS_IN_PLAY || diff === 0) {
        if (!sections[key]) {
          sections[key] = { data: [], title: key };
        }
        sections[key].data.push(fixture);
      }
    } else if (filter === FILTER_PASSED) {
      if (
        (fixture.status === STATUS_CONFIRMED && diff > 0 && diff < 15) ||
        fixture.status === STATUS_FINISHED
      ) {
        if (!sections[key]) {
          sections[key] = { data: [], title: key };
        }
        sections[key].data.push(fixture);
      }
    } else if (filter === FILTER_UPCOMMING) {
      if (
        (fixture.status === STATUS_SCHEDUELED ||
          fixture.status === STATUS_POSTPONED) &&
        diff < 0 &&
        diff > -15
      ) {
        if (!sections[key]) {
          sections[key] = { data: [], title: key };
        }

        sections[key].data.push(fixture);
      }
    }
  }
  for (let key in sections) {
    sections[key].data.sort(fixtureSort);
    sections[key].data = sections[key].data.map(f => f.id);
  }
  return _.values(sections);
}

function* myTeam() {
  try {
    console.log('query my tram data');
    const state = yield select();
    const team = getActiveTeam(state);
    const { data } = yield call(api.getTeamMatches, team.id);
    yield put(setFixtures(_.keyBy(data, 'id')));
  } catch (ex) {
    console.warn(ex);
  }
}

function* leagues() {
  try {
    yield put(LoadingActions.show());
    const leagues = yield call(api.getLeagues);
    yield put(DrawerActions.setLeagues(_.keyBy(leagues.data, 'id')));
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  } finally {
    yield put(LoadingActions.hide());
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
  const id = action.payload.id || action.payload.competitionId;
  try {
    yield put(LoadingActions.show());
    const player = yield call(api.getLeaguePlayers, id);
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
    const { data } = yield call(api.getTeamMatches, action.payload.id);
    yield put(setFixtures(_.keyBy(data, 'id')));
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
    yield put(userSetApiKey(apiKey));
    const { data: token } = yield call(api.refreshAuthentication, apiKey);
    console.log(token);
    yield put(userSetToken(token.token, token.accessForTeams, token.expires));
    api.setAuthorization(token.token);
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
    StatusBar.setBarStyle('light-content');
    const state = yield select();
    const modal =
      state.nav.navigation.routes[state.nav.navigation.index].routeName;
    yield put({
      type: NavigationActions.BACK,
      key: findRouteKey(state.nav.navigation, modal),
    });
    if (modal === Routes.welcome) {
      yield queryOverviewSaga();
    }
  } catch (ex) {
    console.warn(ex);
  }
}

function* getPlayer(action) {
  try {
    yield put(LoadingActions.show());
    const { data, meta } = yield call(api.getPlayer, action.payload.id);
    yield put({ type: PlayerActions.GET_PLAYER_DONE, payload: { data, meta } });
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
    // yield sortOverview();
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
      case Routes.fixtureDetails:
        {
          yield call(getMatch, action);
          NotificationManager.removeNotification(action.params.id);
        }
        break;
      case Routes.myTeam:
        if (!getActiveTeam(state)) {
          yield put(NavigationActions.showLogin());
        } else {
          yield myTeam();
        }
        break;
      case Routes.cup:
        yield getLeagueMatches({ payload: { id: action.params.id } });
        break;
      case Routes.competition:
        {
          const id = action.params.id;
          if (!state.leagues[`${id}`] || !state.leagues[`${id}`].table) {
            yield getLeague({ payload: { id } });
          }
        }
        break;
      case Routes.competitionStats:
        {
          const id = action.params
            ? action.params.id
            : currentRoute(state.nav.navigation).params.id;
          if (!state.leagues[`${id}`] || !state.leagues[`${id}`].players) {
            yield getLeaguePlayerStats({ payload: { id } });
          }
        }
        break;
      case Routes.competitionFixtures:
      case Routes.cup:
        {
          const id = action.params
            ? action.params.id
            : currentRoute(state.nav.navigation).params.id;
          if (!state.leagues[`${id}`] || !state.leagues[`${id}`].match_days) {
            yield getLeagueMatches({ payload: { id } });
          }
        }
        break;
      case Routes.teamDetails:
        {
          const id = action.params
            ? action.params.team.id
            : currentRoute(state.nav.navigation).params.team.id;
          if (!state.teams[`${id}`]) {
            yield getTeam({ payload: { id } });
          }
        }
        break;
      case Routes.teamFixtures:
        {
          const id = action.params
            ? action.params.team.id
            : currentRoute(state.nav.navigation).params.team.id;
          yield getTeamMatches({ payload: { id } });
        }
        break;
      case Routes.myTeamDetails:
        {
          const team = getActiveTeam(state);
          if (!state.teams[`${team.id}`]) {
            yield getTeam({ payload: { id: team.id } });
          }
        }
        break;
      case Routes.playerDetails:
        {
          const id = action.params.id;
          if (!state.players[`${id}`]) {
            yield getPlayer({ payload: { id } });
          }
        }
        break;
      case Routes.fixtureDetailsChangeDate:
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
    if (team && team.access && team.access.token && team.access.apiKey) {
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
    if (_.size(state.drawer) === 0) {
      yield put(NavigationActions.navigate({ routeName: Routes.welcome }));
      const leagues = yield call(api.getLeagues);
      yield put(DrawerActions.setLeagues(_.keyBy(leagues.data, 'id')));
    } else {
      StatusBar.setBarStyle('light-content');
      //check teams has correct groupID
      let update = false;
      for (let cid in state.drawer) {
        const c = state.drawer[cid];
        for (let team of c.teams) {
          if (team.groupId && team.groupId.indexOf('-') === -1) {
            update = true;
            break;
          }
        }
        if (update) break;
      }
      if (update) {
        const { data } = yield call(api.getLeagues);
        yield put(DrawerActions.setLeagues(_.keyBy(data), 'id'));
      }
      yield queryOverviewSaga();
      yield refreshToken();
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
  yield queryOverviewSaga();
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

function* checkChange(/*action*/) {
  // const { loading, overview: data, nav } = yield select();
  // const today = moment().format(DATE_FORMAT);
  // const route = currentRoute(nav.navigation);
  //TODO check app change overview
  // if (
  //   route.routeName === RoutesOld.OVERVIEW &&
  //   action.payload === 'active' &&
  //   !loading.list &&
  //   data.next[today]
  // ) {
  //   yield queryOverviewSaga();
  // }
}

function* fetchUserTeam(action) {
  const { id } = action.payload;
  try {
    yield put(LoadingActions.showModal());
    const { data } = yield call(api.getTeam, id);
    yield put(userAddTeam(data));
    yield subscribeTeamSaga({ payload: { id: data.groupId || data.id } });
    yield put(NavigationActions.navigate({ routeName: Routes.login }));
  } catch (ex) {
    console.warn(ex);
  } finally {
    yield put(LoadingActions.hideModal());
  }
}

function* setFixtureGameResultSaga(action) {
  try {
    yield put(LoadingActions.showModal());
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
        yield refreshToken();
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
    yield call(delay, 200); // FIX for ios
    yield put(LoadingActions.hideModal());
  } catch (ex) {
    yield put(LoadingActions.hideModal());
    console.warn(ex);
  }
}

function delay(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
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
    // const teams = getUserTeams(state);
    // for (let team of teams) {
    //   yield subscribeTeamSaga({ payload: { teamId: team.groupId || team.id } });
    // }
  } catch (ex) {
    console.warn(ex);
  }
}

function* subscribeTeamSaga(action) {
  try {
    const { id } = action.payload;
    yield call(api.postNotificationTeam, id);
  } catch (ex) {
    console.warn(ex);
  }
}

function* subscribeFixtureSaga(action) {
  const { fixtureId } = action.payload;
  const state = yield select();
  try {
    if (SettingsActions.notificationDisabledFixture(state, fixtureId)) {
      yield put(SettingsActions.enableNotificationFixture(fixtureId));
    }
    yield call(api.postNotificationFixture, fixtureId);
  } catch (ex) {
    console.warn(ex);
  }
}

function* unsubscribeFixtureSaga(action) {
  const { fixtureId } = action.payload;
  const state = yield select();
  const fixture = getFixture(state, fixtureId);
  try {
    if (
      SettingsActions.notificationSubscribedForFixtureByTeam(state, fixture)
    ) {
      yield put(SettingsActions.disableNotificationFixture(fixtureId));
    }
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

function* setPlayerAwaySaga(action) {
  try {
    const { id } = action.payload;
    const state = yield select();
    const fixture = getFixture(state, id);
    if (fixture.result) {
      yield setFixtureGameResultSaga(action);
    } else {
      const fixtureGames = getFixtureGames(state, id);
      const fixtureLineUp = getFixtureDefaultLineUp(state, id);
      let allPlayersSet = fixtureLineUp.length > 0;
      for (let game of fixtureLineUp) {
        for (let set of game.gameNumbers) {
          allPlayersSet =
            allPlayersSet &&
            (fixtureGames[set] &&
              fixtureGames[set].homePlayer1 &&
              fixtureGames[set].awayPlayer1)
              ? true
              : false;
          if (game.type == 'DOUBLES') {
            allPlayersSet =
              allPlayersSet &&
              (fixtureGames[set] &&
                fixtureGames[set].homePlayer2 &&
                fixtureGames[set].awayPlayer2)
                ? true
                : false;
          }
        }
        if (!allPlayersSet) {
          break;
        }
      }
      if (allPlayersSet) {
        yield setFixtureGameResultSaga(action);
      }
    }
  } catch (ex) {
    console.warn(ex);
  }
}

function* unsubscribeTeamSaga(action) {
  try {
    const { id } = action.payload;
    yield call(api.deleteNotificationTeam, id);
  } catch (ex) {
    console.warn(ex);
  }
}

function removeTeamSaga() {
  api.unsetAuthorization();
}

export default function* sagas() {
  yield takeEvery(LoadingActions.APP_STATE_CHANGED, checkChange);
  // yield takeEvery(GET_OVERVIEW_MATCHES, overview);
  yield takeEvery(GET_MY_TEAM_MATCHES, myTeam);
  yield takeEvery(GET_LEAGUES, leagues);
  // yield takeEvery(LOGOUT, logout);
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

  yield takeEvery(QUERY_FIXTURE_OVERVIEW, queryOverviewSaga);
  yield takeEvery(QUERY_PLAYER_STATS, getLeaguePlayerStats);

  yield takeEvery(SettingsActions.SUBSCRIBE_TEAM, subscribeTeamSaga);
  yield takeEvery(SettingsActions.UNSUBSCRIBE_TEAM, unsubscribeTeamSaga);
  yield takeEvery(SET_FIXTURE_GAME_RESULT, setFixtureGameResultSaga);
  yield takeEvery(SettingsActions.TOGGLE_NOTIFICATION, toggleNotificationSaga);
  yield takeEvery(SettingsActions.SUBSCRIBE_FIXTURE, subscribeFixtureSaga);
  yield takeEvery(SettingsActions.UNSUBSCRIBE_FIXTURE, unsubscribeFixtureSaga);
  yield takeEvery(SUGGEST_FIXTURE_DATES, suggestFixtureDatesSaga);
  yield takeEvery(ACCEPT_FIXTURE_DATE, acceptFixtureDateSaga);
  yield takeEvery(SUGGEST_FIXTURE_RESULT, setFixtureGameResultSaga);
  yield takeEvery(ACCEPT_FIXTURE_RESULT, setFixtureGameResultSaga);
  yield takeEvery('SELECT_USER_TEAM', fetchUserTeam);
  yield takeEvery(SET_FIXTURE_GAME_AWAY_PLAYER, setPlayerAwaySaga);
  yield takeEvery(USER_REMOVE_TEAM, removeTeamSaga);

  // update overview
  yield takeEvery(SET_FIXTURES, overviewWrapper);
  yield takeEvery(SET_FIXTURE_DATA, overviewWrapper);
}