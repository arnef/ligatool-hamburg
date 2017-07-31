// @flow
import { StatusBar } from 'react-native';
import { takeEvery, put, call, select } from 'redux-saga/effects';
import _ from 'lodash';
import { REHYDRATE } from 'redux-persist/constants';
import * as CacheManager from 'react-native-http-cache';
import * as api from '../lib/api';
import * as NotificationManager from '../lib/NotificationManager';
import { GET_OVERVIEW_MATCHES, OVERVIEW_MATCHES } from './modules/overview';
import {
  GET_MATCHES,
  SET_PLAYER,
  UPDATE_MATCH,
  SUGGEST_SCORE,
  INSERT_RESULTS,
  GET_MATCH,
  GET_MATCH_DONE,
  SUGGEST_DATETIME,
} from './modules/matches';
import { GET_MY_TEAM_MATCHES, MY_TEAM_MATCHES } from './modules/myteam';
import {
  GET_LEAGUES,
  LEAGUES,
  GET_LEAGUE,
  GET_LEAGUE_DONE,
  GET_LEAGUE_MATCHES,
  GET_LEAGUE_MATCHES_DONE,
  GET_LEAGUE_PLAYER_STATS,
  GET_LEAGUE_PLAYER_STATS_DONE,
} from './modules/leagues';
import { LOGOUT, LOGOUT_DONE } from './modules/auth';
import { CLEAR_CACHE } from './modules/settings';
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

import { compareDays, getMatchDays } from '../Helper';
import { currentRoute, findRouteKey } from '../lib/NavUtils';

function* overview() {
  try {
    yield put(LoadingActions.show());
    const matchesData = yield call(api.getMatches);

    const data = {
      today: [],
      next: [],
      played: [],
    };
    const matches = [];
    const now = new Date().getTime();
    const state = yield select();
    let updateDrawer = false;

    for (let match: Match of matchesData.data) {
      if (!state.drawer[`${match.league.id}`]) {
        updateDrawer = true;
      }
      // match = MatchUtils.isAdmin(match, state.auth);
      const diff: number = compareDays(match.datetime, now);
      if ((match.live && diff > -2) || diff === 0) {
        data.today.push(`${match.id}`);
      } else if (match.set_points) {
        data.played.push(`${match.id}`);
      } else if (diff > 0) {
        data.next.push(`${match.id}`);
      }
      matches.push(match);
    }
    yield put({ type: GET_MATCHES, payload: matches });

    yield put({ type: OVERVIEW_MATCHES, payload: data });

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

function* myTeam() {
  try {
    yield put(LoadingActions.show());
    const state = yield select();
    const matchesData = yield call(api.getTeamMatches, state.settings.team.id);
    const payload = { next: [], played: [] };
    for (let match: Match of matchesData.data) {
      if (match.set_points && !match.score_unconfirmed) {
        payload.played.push(`${match.id}`);
      } else {
        payload.next.push(`${match.id}`);
      }
    }
    yield put({ type: GET_MATCHES, payload: matchesData.data });
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
    yield put({
      type: LEAGUES,
      payload: _.keyBy(leagues.data, o => `${o.id}`),
    });
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

function* clearCache() {
  try {
    yield put(LoadingActions.showModal());
    yield call(CacheManager.clearCache);
  } catch (ex) {
    console.warn(ex);
  } finally {
    yield put(LoadingActions.hideModal());
  }
}

function* getMatch(action) {
  try {
    yield put(LoadingActions.show());
    const matchData = yield call(api.getMatch, action.params.id);
    let match = { ...matchData.data, type: MatchUtils.getType(matchData.data) };

    if (match.set_points) {
      match = { ...match, games: MatchUtils.sets(match) };
    }
    yield put({
      type: GET_MATCH_DONE,
      payload: match,
    });
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
    yield put({ type: GET_LEAGUE_DONE, payload: league.data });
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
    yield put({ type: GET_MATCHES, payload: matches.data });
    yield put({
      type: GET_LEAGUE_MATCHES_DONE,
      payload: {
        ...getMatchDays(matches.data),
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
    const team = yield call(api.getTeam, action.payload.id);
    yield put({
      type: GET_TEAM_DONE,
      payload: { ...team.data, id: `${team.data.id}` },
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
    const user = yield call(api.authenticate, action.payload);
    const apiKey = user.data.access_key;
    yield put(AuthActions.setApiKey(apiKey));
    const team = yield call(api.refreshAuthentication, apiKey);
    const ids = team.data.ids.map(item => `${item}`);
    yield put(
      AuthActions.setToken({
        expires: team.data.expires,
        token: team.data.token,
        ids,
      }),
    );
    const state = yield select();
    if (state.settings.notification.on) {
      yield put(SettingsActions.setNotification({ matchdate: true }));
    }
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
    yield put(LoadingActions.showModal());
    let payload = { sets: action.payload.sets };
    if (action.type === SUGGEST_SCORE) {
      const state = yield select();
      const match = state.matches[`${action.payload.id}`];
      if (match.state === 0) {
        payload = { ...payload, score_suggest: true };
      } else if (match.state === 2) {
        payload = { ...payload, score_unconfirmed: false };
      }
    }
    const matchData = yield call(api.updateMatch, action.payload.id, payload);
    const match = matchData.data;
    yield put({
      type: GET_MATCH_DONE,
      payload: { ...match, games: MatchUtils.sets(match) },
    });
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  } finally {
    yield put(LoadingActions.hideModal());
  }
}

function* setPlayer(action) {
  try {
    const state = yield select();
    const match = MatchUtils.setPlayer(
      state.matches[`${action.payload.id}`],
      action.payload,
    );
    yield put({ type: GET_MATCH_DONE, payload: match });
    if (action.payload.team === 'away') {
      yield put(NavigationActions.hidePlayer());
      if (match.lineUp && match.lineUp.update) {
        yield put({
          type: UPDATE_MATCH,
          payload: { id: match.id, sets: match.sets },
        });
      }
    }
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.error(ex.message));
  }
}

function* navigate(action) {
  try {
    yield put(LoadingActions.hide());
    const state = yield select();
    if (state.settings.changed && state.settings.fcm_token) {
      yield call(
        api.updateNotifications,
        state.settings.fcm_token,
        state.settings.notification,
      );
      yield put(SettingsActions.synchronized());
    }
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
        if (!state.settings.team) {
          yield put(NavigationActions.showLogin());
        } else if (
          state.myTeam.next.length === 0 &&
          state.myTeam.played.length === 0
        ) {
          yield myTeam();
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
          const id = state.settings.team.id;
          if (!state.teams[`${id}`]) {
            yield getTeam({ payload: { id } });
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
    }
  } catch (ex) {
    console.warn(ex);
  }
}

function* updateNotifications() {
  try {
    const state = yield select();
    if (state.settings.fcm_token) {
      api.setFCM(state.settings.fcm_token);
      yield call(
        api.updateNotifications,
        state.settings.fcm_token,
        state.settings.notification,
      );
    }
  } catch (ex) {
    console.warn(ex);
  }
}

function* rehydrate() {
  try {
    const state = yield select();
    if (_.size(state.drawer) > 0) {
      StatusBar.setBarStyle('light-content');
      if (state.auth.api_key && state.auth.team) {
        if (state.auth.team.expires < new Date().getTime()) {
          yield put(LoadingActions.showModal());
          const team = yield call(
            api.refreshAuthentication,
            state.auth.api_key,
          );
          const ids = team.data.ids.map(item => `${item}`);
          yield put(
            AuthActions.setToken({
              expires: team.data.expires,
              token: team.data.token,
              ids,
            }),
          );
        } else {
          api.setSecret(state.auth.team.token);
        }
      }
      yield overview();
    } else {
      yield put(
        NavigationActions.navigate({ routeName: Routes.MODAL_FIRST_START }),
      );
      const leagues = yield call(api.getLeagues);
      yield put(DrawerActions.setLeagues(_.keyBy(leagues.data, 'id')));
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
    if (state.settings.team) {
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

export default function* sagas(): any {
  yield takeEvery(GET_OVERVIEW_MATCHES, overview);
  yield takeEvery(GET_MY_TEAM_MATCHES, myTeam);
  yield takeEvery(GET_LEAGUES, leagues);
  yield takeEvery(LOGOUT, logout);
  yield takeEvery(CLEAR_CACHE, clearCache);
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
  yield takeEvery(UPDATE_MATCH, updateMatch);
  yield takeEvery(SET_PLAYER, setPlayer);
  yield takeEvery(NavigationActions.NAVIGATE, navigate);
  yield takeEvery(NavigationActions.BACK, navigate);
  yield takeEvery(REHYDRATE, rehydrate);
  yield takeEvery(SettingsActions.SET_FCM_TOKEN, updateNotifications);
  yield takeEvery(SUGGEST_SCORE, updateMatch);
  yield takeEvery(INSERT_RESULTS, insertResults);
  yield takeEvery(SUGGEST_DATETIME, suggestDatetime);
  yield takeEvery(NavigationActions.HIDE_START_MODAL, hideStart);
  yield takeEvery(SettingsActions.COMPLETE_SETUP, completeSetup);
}
