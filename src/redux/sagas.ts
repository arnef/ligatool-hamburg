/**
 * Copyright (C) 2018 Arne Feil
 *
 * This file is part of DTFB App.
 *
 * DTFB App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DTFB App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DTFB App.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { DATE_FORMAT, DATETIME_DB } from '@app/config/settings';
import { getMatchDays } from '@app/helper';
import * as api from '@app/lib/api';
import { currentRoute, findRouteKey } from '@app/lib/NavUtils';
import * as NotificationManager from '@app/lib/NotificationManager';
import { Routes } from '@app/scenes/routes';
import _ from 'lodash';
import moment from 'moment';
import { StatusBar } from 'react-native';
import { REHYDRATE } from 'redux-persist';
import { call, put, select, takeEvery } from 'redux-saga/effects';

import { QUERY_FIXTURE_OVERVIEW, QUERY_PLAYER_STATS } from './actions';
import * as AuthActions from './modules/auth';
import * as DrawerActions from './modules/drawer';
import {
  ACCEPT_FIXTURE_DATE,
  ACCEPT_FIXTURE_RESULT,
  FILTER_PASSED,
  FILTER_TODAY,
  FILTER_UPCOMMING,
  fixtureSort,
  GET_MATCH,
  GET_MATCH_DONE,
  getFixture,
  getFixtureDates,
  getFixtureDefaultLineUp,
  getFixtureGame,
  getFixtureGames,
  getFixtureModus,
  SET_FIXTURE_DATA,
  SET_FIXTURE_GAME_AWAY_PLAYER,
  SET_FIXTURE_GAME_RESULT,
  SET_FIXTURES,
  setFixtureData,
  setFixtureDates,
  setFixtureMeta,
  setFixtures,
  setOverview,
  STATUS_CONFIRMED,
  STATUS_FINISHED,
  STATUS_IN_PLAY,
  STATUS_POSTPONED,
  STATUS_SCHEDUELED,
  SUGGEST_DATETIME,
  SUGGEST_FIXTURE_DATES,
  SUGGEST_FIXTURE_RESULT,
} from './modules/fixtures';
import {
  GET_LEAGUE,
  GET_LEAGUE_DONE,
  GET_LEAGUE_MATCHES,
  GET_LEAGUE_MATCHES_DONE,
  GET_LEAGUE_PLAYER_STATS,
  GET_LEAGUE_PLAYER_STATS_DONE,
  GET_LEAGUES,
} from './modules/leagues';
import * as LoadingActions from './modules/loading';
import { GET_MY_TEAM_MATCHES } from './modules/myteam';
import * as NavigationActions from './modules/navigation';
import * as PlayerActions from './modules/player';
import * as SettingsActions from './modules/settings';
import { GET_TEAM, GET_TEAM_DONE, GET_TEAM_MATCHES } from './modules/teams';
import {
  getActiveTeam,
  USER_REMOVE_TEAM,
  userAddTeam,
  userSetApiKey,
  userSetToken,
} from './modules/user';

function* queryOverviewSaga() {
  try {
    yield put(LoadingActions.show());
    const matchesData = yield call(api.getMatches);
    const state = yield select();
    let updateDrawer = false;

    for (const match of matchesData.data) {
      if (!state.drawer[match.competitionId]) {
        updateDrawer = true;
        break;
      }
    }
    yield put(setFixtures(_.keyBy(matchesData.data, 'id')));
    yield overviewWrapper();
    yield put(LoadingActions.hide());
    NotificationManager.removeAllNotifications();
    if (updateDrawer) {
      const competitions = yield call(api.getLeagues);
      yield put(DrawerActions.setLeagues(_.keyBy(competitions.data, 'id')));
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
function buildOverview(data: any, filter: string) {
  const sections: { [key: string]: any } = {};
  const today = moment();
  // for (let id in get(state).data) {
  for (const fixture of data) {
    // const fixture = getFixture(state, id);
    const diff =
      parseInt(today.format('YYYYMMDD'), 10) -
      parseInt(moment(fixture.date, DATETIME_DB).format('YYYYMMDD'), 10);
    const key = moment(fixture.date, DATETIME_DB).format(DATE_FORMAT);
    if (filter === FILTER_TODAY) {
      if (fixture.status === STATUS_IN_PLAY || diff === 0) {
        if (!sections[key]) {
          sections[key] = { data: [], title: key };
        }
        sections[key].data.push(fixture.id);
      }
    } else if (filter === FILTER_PASSED) {
      if (
        (fixture.status === STATUS_CONFIRMED && diff > 0 && diff < 15) ||
        fixture.status === STATUS_FINISHED
      ) {
        if (!sections[key]) {
          sections[key] = { data: [], title: key };
        }
        sections[key].data.push(fixture.id);
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

        sections[key].data.push(fixture.id);
      }
    }
  }
  for (const key in sections.keys) {
    if (key) {
      sections[key].data.sort(fixtureSort);
      sections[key].data = sections[key].data.map((f: any) => f.id);
    }
  }
  return _.values(sections);
}

function* myTeam() {
  try {
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
    const competitions = yield call(api.getLeagues);
    yield put(DrawerActions.setLeagues(_.keyBy(competitions.data, 'id')));
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  } finally {
    yield put(LoadingActions.hide());
  }
}

function* getMatch(action: any) {
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

function* getLeague(action: any) {
  try {
    yield put(LoadingActions.show());
    const league = yield call(api.getLeague, action.payload.id);
    yield put({
      payload: { ...league.data, table: league.meta.leagueTable },
      type: GET_LEAGUE_DONE,
    });
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  } finally {
    yield put(LoadingActions.hide());
  }
}

function* getLeagueMatches(action: any) {
  try {
    yield put(LoadingActions.show());
    const matches = yield call(api.getLeagueMatches, action.payload.id);
    yield put(setFixtures(_.keyBy(matches.meta.fixtures, 'id')));
    yield put({
      payload: {
        ...getMatchDays(matches.meta.fixtures),
        id: `${action.payload.id}`,
      },
      type: GET_LEAGUE_MATCHES_DONE,
    });
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  } finally {
    yield put(LoadingActions.hide());
  }
}

function* getLeaguePlayerStats(action: any) {
  const id = action.payload.id || action.payload.competitionId;
  try {
    yield put(LoadingActions.show());
    const player = yield call(api.getLeaguePlayers, id);
    yield put({
      payload: { id: `${action.payload.id}`, players: player.data },
      type: GET_LEAGUE_PLAYER_STATS_DONE,
    });
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  } finally {
    yield put(LoadingActions.hide());
  }
}

function* getTeam(action: any) {
  try {
    yield put(LoadingActions.show());
    const { data, meta } = yield call(api.getTeam, action.payload.id);
    yield put({
      payload: {
        ...data,
        club: meta.club,
        contact: meta.contact,
        homeFixture: meta.homeFixture,
        player: meta.player,
        standing: meta.standing,
        venue: meta.venue,
      },
      type: GET_TEAM_DONE,
    });
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  } finally {
    yield put(LoadingActions.hide());
  }
}

function* getTeamMatches(action: any) {
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

function* login(action: any) {
  try {
    yield put(LoadingActions.show());
    const { data } = yield call(api.authenticate, action.payload);
    const apiKey = data.token;
    yield put(userSetApiKey(apiKey));
    const { data: token } = yield call(api.refreshAuthentication, apiKey);
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
      key: findRouteKey(state.nav.navigation, modal),
      type: NavigationActions.BACK,
    });
    if (modal === Routes.welcome) {
      yield queryOverviewSaga();
    }
  } catch (ex) {
    console.warn(ex);
  }
}

function* getPlayer(action: any) {
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

function* navigate(action: any) {
  try {
    yield put(LoadingActions.hide());
    const state = yield select();
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

function* getFixtureDatesSaga(action: any) {
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
      const competitions = yield call(api.getLeagues);
      yield put(DrawerActions.setLeagues(_.keyBy(competitions.data, 'id')));
    } else {
      StatusBar.setBarStyle('light-content');
      // check teams has correct groupID
      let update = false;
      for (const cid in state.drawer) {
        if (cid) {
          const c = state.drawer[cid];
          for (const team of c.teams) {
            if (team.groupId && team.groupId.indexOf('-') === -1) {
              update = true;
              break;
            }
          }
          if (update) {
            break;
          }
        }
      }
      if (update) {
        const { data } = yield call(api.getLeagues);
        yield put(DrawerActions.setLeagues(_.keyBy(data, 'id')));
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
          params: { init: true },
          routeName: 'LoginView',
        }),
      );
    }
  } catch (ex) {
    console.warn(ex);
  }
}

function* suggestDatetime(action: any) {
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
        ended: true,
        live: true,
        matchdate: state.auth.api_key ? true : false,
        on: true,
      }),
    );
  }
  yield put(NavigationActions.hideStart());
}

function* fetchUserTeam(action: any) {
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

function* setFixtureGameResultSaga(action: any) {
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
      for (const item of defaultModus) {
        for (const gameNumber of item.gameNumbers) {
          const game = getFixtureGame(state, payload.id, gameNumber);
          if (game.result || (game.homePlayer1 && game.awayPlayer1)) {
            body.push({
              away_player_1_id: game.awayPlayer1 ? game.awayPlayer1.id : null,
              away_player_2_id: game.awayPlayer2 ? game.awayPlayer2.id : null,
              game_number: gameNumber,
              goals_away: game.result ? game.result.goalsAway : null,
              goals_home: game.result ? game.result.goalsHome : null,
              home_player_1_id: game.homePlayer1 ? game.homePlayer1.id : null,
              home_player_2_id: game.homePlayer2 ? game.homePlayer2.id : null,
              key: item.key,
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

function delay(time: number) {
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

function* subscribeTeamSaga(action: any) {
  try {
    const { id } = action.payload;
    yield call(api.postNotificationTeam, id);
  } catch (ex) {
    console.warn(ex);
  }
}

function* subscribeFixtureSaga(action: any) {
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

function* unsubscribeFixtureSaga(action: any) {
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

function* suggestFixtureDatesSaga(action: any) {
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

function* acceptFixtureDateSaga(action: any) {
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

function* setPlayerAwaySaga(action: any) {
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
      for (const game of fixtureLineUp) {
        for (const set of game.gameNumbers) {
          allPlayersSet =
            allPlayersSet &&
            (fixtureGames[set] &&
              fixtureGames[set].homePlayer1 &&
              fixtureGames[set].awayPlayer1)
              ? true
              : false;
          if (game.type === 'DOUBLES') {
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

function* unsubscribeTeamSaga(action: any) {
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
