// @flow
import {
  FULFILLED,
  QUERY_MATCHES,
  QUERY_TEAM_MATCHES,
  QUERY_MY_TEAM_MATCHES,
  QUERY_LEAGUE_MATCHES,
  GET_MATCH,
  PUT_SETS,
  SET_PLAYER,
  TOGGLE_D5,
  SCORE,
  SUGGEST_SCORE,
  SCORE_CONFIRMED,
  NOTIFICATION
} from '../actions/types';
import { isAdminForMatch } from '../../Helper';

const initialState: MatchesState = {};

export default function (state: MatchesState = initialState, action: Action): MatchesState {

  switch (action.type) {
    case QUERY_MATCHES + FULFILLED:
    case QUERY_TEAM_MATCHES + FULFILLED:
    case QUERY_MY_TEAM_MATCHES + FULFILLED:
    case QUERY_LEAGUE_MATCHES + FULFILLED:
      if (action.payload.ok) {
        state = { ...state };
        for (let match: Match of action.payload.data) {
          match.is_admin = isAdminForMatch(match);
          if (state[match.id]) {
            state[match.id] = { ...state[match.id], ...match};
          } else {
            state[match.id] = match;
          }
        }
      }

      return state;

    case PUT_SETS + FULFILLED:
    case GET_MATCH + FULFILLED: {
      if (action.payload.ok) {
        const match: Match = action.payload.data;

        state = { ...state };
        match.sets = compareSets(match, state[action.payload.data.id]);
        match.type = getMatchType(match);
        match.is_admin = isAdminForMatch(match);
        state[match.id] = match;
      }
      return state;
    }

    case SET_PLAYER: {
      state = { ...state };
      const match: Match = state[action.payload.id];
      if (!match.sets) { match.sets = {}; }
      for (let idx: number of action.payload.setsIdx) {
        const set = match.sets[idx] || {};
        for (let i = 0; i < action.payload.player.length; i++) {
          set[`player_${i + 1}_${action.payload.team}`] = action.payload.player[i];
        }
        set.number = idx;
        match.sets[idx] = set;
      }
      return state;
    }

    case TOGGLE_D5: {
      const match: Match = state[action.payload.id];

      state = { ...state };

      if (match) {
        for (let idx: number of action.payload.idx) {
          if (match.sets && match.sets[idx]) {
            match.sets[idx].player_1_home = null;
            match.sets[idx].player_2_home = null;
            match.sets[idx].player_1_away = null;
            match.sets[idx].player_2_away = null;
            match.sets[idx].goals_home = null;
            match.sets[idx].goals_away = null;
          }
        }
        match.type = action.payload.type;
      }
      return state;
    }

    case SCORE + NOTIFICATION:
    case SUGGEST_SCORE + NOTIFICATION: {

      const id: number = parseInt(action.payload.id, 10);
      if (state[id]) {
        state = { ...state };
        state[id].set_points = true;
        state[id].set_points_home = parseInt(action.payload.set_points_home, 10);
        state[id].set_points_away = parseInt(action.payload.set_points_away, 10);
        state[id].live = JSON.parse(action.payload.live) ? true : false;
      }
      return state;
    }

    case SCORE_CONFIRMED + NOTIFICATION: {
      const id: number = parseInt(action.payload.id, 10);
      if (state[id]) {
        state = { ...state };
        state[id].score_unconfirmed = parseInt(action.payload.score_unconfirmed);
        state[id].live = false;
      }
      return state;
    }

    default:
      return state;
  }
}

function getMatchType(match: Match): string {
  let type: string = match.league.cup ? 'cup' : 'default';
  const sets = match && match.sets ? match.sets : {};

  if (sets['5'] && sets['6']) {
    if (sets['5'].player_2_home !== null && sets['6'].player_2_away !== null) {
      type += '_d5';
    }
  }

  return type;
}

function compareSets(match: Match, cacheMatch: ?Match): any {
  let sets = match.sets || {};

  if (cacheMatch && cacheMatch.sets) {
    for(let nr: string in cacheMatch.sets) {
      if (!match.sets[nr] && cacheMatch.sets[nr]) {
          sets[nr] = cacheMatch.sets[nr]
        }
      }
    }

    return sets;
}
