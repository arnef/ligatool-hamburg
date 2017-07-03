// @flow
// Type Definitions
type State = {
  today: Array<number>,
  next: Array<number>,
  played: Array<number>,
};

type Action = {
  type: OVERVIEW_MATCHES,
  payload: {
    today: Array<number>,
    next: Array<number>,
    played: Array<number>,
  },
};

// Actions
export const GET_OVERVIEW_MATCHES: GET_OVERVIEW_MATCHES =
  'ligatool/modules/GET_OVERVIEW_MATCHES';
export const OVERVIEW_MATCHES: OVERVIEW_MATCHES =
  'ligatool/modules/OVERVIEW_MATCHES';

// Reducer
export default function reducer(
  state: State = {
    today: [],
    next: [],
    played: [],
  },
  action: Action,
): State {
  switch (action.type) {
    case OVERVIEW_MATCHES:
      state = { ...state, ...action.payload };
      break;
  }

  return state;
}

// Action Creators
export function getMatches() {
  return { type: GET_OVERVIEW_MATCHES };
}
