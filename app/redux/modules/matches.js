// @flow
import * as MatchLib from '../../libs/Match';
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
export const TOGGLE_MATCH_TYPE: TOGGLE_MATCH_TYPE =
  'ligatool/modules/matches/TOGGLE_TYPE';
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
        [`${action.payload.id}`]: MatchLib.toggleType(
          state[`${action.payload.id}`],
          action.payload.type,
          action.payload.setsIdx,
        ),
      };
      break;
  }
  return state;
}

// Action Creators
export function getMatch(id: number) {
  return { type: GET_MATCH, payload: { id } };
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

export function setType(payload: {
  type: string,
  id: number | string,
  setsIdx: Array<number | string>,
}) {
  return { type: TOGGLE_MATCH_TYPE, payload };
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
