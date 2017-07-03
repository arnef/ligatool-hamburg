// @flow
// Type Definitions
type State = {
  next: Array<number>,
  played: Array<number>,
};

type Action = {
  type: MY_TEAM_MATCHES,
  payload: {
    next: Array<number>,
    played: Array<number>,
  },
};

// Actions
export const GET_MY_TEAM_MATCHES: GET_MY_TEAM_MATCHES =
  'ligatool/modules/GET_MY_TEAM_MATCHES';
export const MY_TEAM_MATCHES: MY_TEAM_MATCHES =
  'ligatool/modules/MY_TEAM_MATCHES';

// Reducer
export default function reducer(
  state: State = {
    next: [],
    played: [],
  },
  action: Action,
): State {
  switch (action.type) {
    case MY_TEAM_MATCHES:
      state = { ...state, ...action.payload };
      break;
  }
  return state;
}

// Action Creators
export function getMatches() {
  return { type: GET_MY_TEAM_MATCHES };
}
