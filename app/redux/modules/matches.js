// @flow
import * as MatchUtil from '../../lib/MatchUtil';
// Type Definitions
type State = {
  +[string]: Match,
};

type Action = {
  type: GET_MATCHES,
  data: Array<Match>,
};

// Actions
export const GET_MATCHES: GET_MATCHES = 'GET_MATCHES';
export const GET_MATCH: GET_MATCH = 'ligatool/modules/GET_MATCH';
export const GET_MATCH_DONE: GET_MATCH_DONE = 'ligatool/modules/GET_MATCH_DONE';
export const SET_PLAYER: SET_PLAYER = 'ligatool/modules/matches/SET_PLAYER';
export const UPDATE_MATCH: UPDATE_MATCH =
  'ligatool/modules/matches/UPDATE_MATCH';
export const SUGGEST_SCORE: SUGGEST_SCORE = 'ligattol/matches/SUGGEST_SCORE';
export const TOGGLE_MATCH_TYPE: TOGGLE_MATCH_TYPE =
  'ligatool/modules/matches/TOGGLE_TYPE';
const LIVE_NOTIFICATION: LIVE_NOTIFICATION =
  'ligatool/matches/LIVE_NOTIFICATION';
const END_NOTIFICATION: END_NOTIFICATION = 'ligatool/matches/END_NOTIFICAION';

// Reducer
export default function reducer(state: State = {}, action: Action): State {
  switch (action.type) {
    case GET_MATCHES:
      state = getStateForAction(state, action);
      break;
    case GET_MATCH_DONE:
      state = {
        ...state,
        [`${action.payload.id}`]: {
          ...state[`${action.payload.id}`],
          ...action.payload,
        },
      };
      break;
    case TOGGLE_MATCH_TYPE:
      state = {
        ...state,
        [`${action.payload.id}`]: MatchUtil.toggleType(
          state[`${action.payload.id}`],
          action.payload.type,
          action.payload.setsIdx,
        ),
      };
      break;
    case LIVE_NOTIFICATION:
      if (state[action.payload.id]) {
        state = {
          ...state,
          [action.payload.id]: {
            ...state[action.payload.id],
            set_points: true,
            set_points_home: parseInt(action.payload.set_points_home, 10),
            set_points_away: parseInt(action.payload.set_points_away, 10),
            live: JSON.parse(action.payload.live) ? true : false,
          },
        };
      }
      break;
    case END_NOTIFICATION:
      if (state[action.payload.id]) {
        state = {
          ...state,
          [action.payload.id]: {
            ...state[action.payload.id],
            score_unconfirmed: parseInt(action.payload.score_unconfirmed, 10),
            live: false,
          },
        };
      }
      break;
  }
  return state;
}

// Action Creators
export function getMatch(id: number) {
  return { type: GET_MATCH, params: { id } };
}

export function setPlayer(payload: {
  id: number,
  team: Team,
  player: Array<Player>,
  setsIdx: Array<number>,
}) {
  return { type: SET_PLAYER, payload };
}

export function update(payload: { id: number, sets: { [string]: Sets } }) {
  return { type: UPDATE_MATCH, payload };
}

export function suggest(payload: { id: number, sets: { [string]: Sets } }) {
  return { type: SUGGEST_SCORE, payload };
}

export function setType(payload: {
  type: string,
  id: number | string,
  setsIdx: Array<number | string>,
}) {
  return { type: TOGGLE_MATCH_TYPE, payload };
}

export function notification(payload: any) {
  if (payload.type === 'SCORE_CONFIRMED') {
    return { type: END_NOTIFICATION, payload };
  } else {
    return { type: LIVE_NOTIFICATION, payload };
  }
}

function getStateForAction(state: State, action: Action): State {
  for (let match: Match of action.data) {
    if (state[`${match.id}`]) {
      state = {
        ...state,
        [`${match.id}`]: { ...state[`${match.id}`], ...match },
      };
    } else {
      state = { ...state, [`${match.id}`]: match };
    }
  }

  return state;
}
