import * as MatchUtils from '@app/lib/MatchUtils';

// Actions
export const GET_MATCHES = 'GET_MATCHES';
export const GET_MATCH = 'ligatool/modules/GET_MATCH';
export const GET_MATCH_DONE = 'ligatool/modules/GET_MATCH_DONE';
export const SET_PLAYER = 'ligatool/modules/matches/SET_PLAYER';
export const INSERT_RESULTS = 'ligatool/matches/INSERT_RESULTS';
export const SUGGEST_DATETIME = 'ligatool/matches/SUGGEST_DATETIME';
export const UPDATE_MATCH = 'ligatool/modules/matches/UPDATE_MATCH';
export const SUGGEST_SCORE = 'ligattol/matches/SUGGEST_SCORE';
export const TOGGLE_MATCH_TYPE = 'ligatool/modules/matches/TOGGLE_TYPE';
const LIVE_NOTIFICATION = 'ligatool/matches/LIVE_NOTIFICATION';
const END_NOTIFICATION = 'ligatool/matches/END_NOTIFICAION';

// Reducer
export default function reducer(state = {}, action) {
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
        [`${action.payload.id}`]: MatchUtils.toggleType(
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

            set_points: {
              home: parseInt(action.payload.set_points_home, 10),
              away: parseInt(action.payload.set_points_away, 10),
            },
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
export function getMatch(id) {
  return { type: GET_MATCH, params: { id } };
}

export function setPlayer(payload) {
  return { type: SET_PLAYER, payload };
}

export function update(payload) {
  return { type: UPDATE_MATCH, payload };
}

export function suggest(payload) {
  return { type: SUGGEST_SCORE, payload };
}

export function setType(payload) {
  return { type: TOGGLE_MATCH_TYPE, payload };
}

export function suggestDatetime(id, datetime_suggestions) {
  return { type: SUGGEST_DATETIME, payload: { id, datetime_suggestions } };
}

export function notification(payload) {
  if (payload.type === 'SCORE_CONFIRMED') {
    return { type: END_NOTIFICATION, payload };
  } else if (
    payload.type === 'LIVE_SCORE' ||
    payload.type === 'SUGGEST_SCORE'
  ) {
    return { type: LIVE_NOTIFICATION, payload };
  }
  return { type: 'IGNORE' };
}

export function insertResults(id) {
  return { type: INSERT_RESULTS, payload: { id } };
}

function getStateForAction(state, action) {
  for (let match of action.payload) {
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