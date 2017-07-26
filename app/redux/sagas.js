// @flow
import { takeEvery, put, call, select } from 'redux-saga/effects';
import _ from 'lodash';
import { REHYDRATE } from 'redux-persist/constants';
import * as CacheManager from 'react-native-http-cache';
import * as api from '../lib/api';
// import * as api from '../apiOLD';
import { GET_OVERVIEW_MATCHES, OVERVIEW_MATCHES } from './modules/overview';
import {
  GET_MATCHES,
  SET_PLAYER,
  UPDATE_MATCH,
  SUGGEST_SCORE,
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
import { GET_MATCH, GET_MATCH_DONE } from './modules/matches';
import {
  GET_TEAM,
  GET_TEAM_DONE,
  GET_TEAM_MATCHES,
  GET_TEAM_MATCHES_DONE,
} from './modules/teams';
import * as AuthActions from './modules/auth';
import * as NavigationActions from './modules/navigation';
import * as PlayerActions from './modules/player';
import * as MatchLib from '../libs/Match';
import * as DrawerActions from './modules/drawer';
import * as SettingsActions from './modules/settings';
import Routes from '../config/routes';

import { compareDays, getMatchDays } from '../Helper';

function* overview() {
  try {
    yield put(LoadingActions.show());
    const matches = yield call(api.getMatches);
    yield put({ type: GET_MATCHES, data: matches.data });
    const data = {
      today: [],
      next: [],
      played: [],
    };
    const now = new Date().getTime();
    const state = yield select();
    let updateDrawer = false;
    for (let match: Match of matches.data) {
      if (!state.drawer[`${match.league.id}`]) {
        updateDrawer = true;
      }

      const diff: number = compareDays(match.datetime, now);
      if ((match.live && diff > -2) || diff === 0) {
        data.today.push(`${match.id}`);
      } else if (match.set_points) {
        data.played.push(`${match.id}`);
      } else if (diff > 0) {
        data.next.push(`${match.id}`);
      }
    }
    yield put({ type: OVERVIEW_MATCHES, payload: data });
    yield put(LoadingActions.hide());
    if (updateDrawer) {
      const leagues = yield call(api.getLeagues);
      yield put(
        DrawerActions.setLeagues(
          _.keyBy(leagues.data, l => {
            return `${l.id}`;
          }),
        ),
      );
    }
  } catch (ex) {
    console.warn(ex);
    yield put(LoadingActions.hide());
  }
}

function* myTeam() {
  try {
    yield put(LoadingActions.show());
    const state = yield select();
    const matches = yield call(api.getTeamMatches, state.settings.team.id);
    yield put({ type: GET_MATCHES, data: matches.data });
    const payload = { next: [], played: [] };
    for (let match: Match of matches.data) {
      if (match.set_points && !match.score_unconfirmed) {
        payload.played.push(`${match.id}`);
      } else {
        payload.next.push(`${match.id}`);
      }
    }
    yield put({ type: MY_TEAM_MATCHES, payload });
  } catch (ex) {
    console.warn(ex);
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
  } finally {
    yield put(LoadingActions.hide());
  }
}

function* logout() {
  try {
    yield put(LoadingActions.showModal());
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
    const state = yield select();
    const match = MatchLib.isAdmin(matchData.data, state.auth);
    yield put({
      type: GET_MATCH_DONE,
      payload: { ...match, games: MatchLib.sets(match) },
    });
  } catch (ex) {
    console.warn(ex);
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
  } finally {
    yield put(LoadingActions.hide());
  }
}

function* getLeagueMatches(action) {
  try {
    yield put(LoadingActions.show());
    const matches = yield call(api.getLeagueMatches, action.payload.id);
    yield put({ type: GET_MATCHES, data: matches.data });
    yield put({
      type: GET_LEAGUE_MATCHES_DONE,
      payload: {
        ...getMatchDays(matches.data),
        id: `${action.payload.id}`,
      },
    });
  } catch (ex) {
    console.warn(ex);
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
  } finally {
    yield put(LoadingActions.hide());
  }
}

function* getTeamMatches(action) {
  try {
    yield put(LoadingActions.show());
    const matches = yield call(api.getTeamMatches, action.payload.id);
    yield put({ type: GET_MATCHES, data: matches.data });
    yield put({
      type: GET_TEAM_MATCHES_DONE,
      payload: {
        id: `${action.payload.id}`,
        matches: matches.data.map(m => `${m.id}`),
      },
    });
  } catch (ex) {
    console.warn(ex);
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
    yield put(NavigationActions.hideLogin(action.next));
  } catch (ex) {
    yield put(LoadingActions.error(ex.message));
    console.warn(ex);
  } finally {
    yield put(LoadingActions.hide());
  }
}

function* hideLogin(action) {
  if (action.next) {
    yield put(NavigationActions.navigate({ routeName: action.next }));
  }
}

function* getPlayer(action) {
  try {
    yield put(LoadingActions.show());
    const player = yield call(api.getPlayer, action.payload.id);
    yield put({ type: PlayerActions.GET_PLAYER_DONE, payload: player.data });
  } catch (ex) {
    console.warn(ex);
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
      if (match.can_suggest_score === 0) {
        payload = { ...payload, score_suggest: true };
      } else if (match.can_suggest_score === 2) {
        payload = { ...payload, score_unconfirmed: false };
      }
    }
    const matchData = yield call(api.updateMatch, action.payload.id, payload);
    const state = yield select();
    const match = MatchLib.isAdmin(matchData.data, state.auth);
    yield put({
      type: GET_MATCH_DONE,
      payload: { ...match, games: MatchLib.sets(match) },
    });
  } catch (ex) {
    console.warn(ex);
  } finally {
    yield put(LoadingActions.hideModal());
  }
}

function* setPlayer(action) {
  try {
    const state = yield select();
    const match = MatchLib.setPlayer(
      state.matches[`${action.payload.id}`],
      action.payload,
    );
    console.log(match);
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
  }
}

function* navigate(action) {
  try {
    const state = yield select();
    if (state.settings.changed && state.settings.fcm_token) {
      yield call(
        api.updateNotifications,
        state.settings.fcm_token,
        state.settings.notification,
      );
      yield put(SettingsActions.synchronized());
    }
    switch (action.routeName) {
      case Routes.MATCH:
        yield call(getMatch, action);
        break;
    }
  } catch (ex) {
    console.warn(ex);
  } finally {
    // yield put(LoadingActions.hide());
  }
}

function* updateNotifications() {
  try {
    const state = yield select();
    if (state.settings.fcm_token) {
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
    if (state.auth.api_key && state.auth.team) {
      if (state.auth.team.expires < new Date().getTime()) {
        yield put(LoadingActions.showModal());
        const team = yield call(api.refreshAuthentication, state.auth.api_key);
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
  } catch (ex) {
    console.warn(ex);
  } finally {
    yield put(LoadingActions.hideModal());
  }
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
  yield takeEvery(PlayerActions.GET_PLAYER, getPlayer);
  yield takeEvery(UPDATE_MATCH, updateMatch);
  yield takeEvery(SET_PLAYER, setPlayer);
  yield takeEvery(NavigationActions.NAVIGATE, navigate);
  yield takeEvery(NavigationActions.BACK, navigate);
  yield takeEvery(REHYDRATE, rehydrate);
  yield takeEvery(SettingsActions.SET_FCM_TOKEN, updateNotifications);
  yield takeEvery(SUGGEST_SCORE, updateMatch);
}
