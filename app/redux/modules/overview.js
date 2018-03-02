// Actions
export const GET_OVERVIEW_MATCHES = 'ligatool/modules/GET_OVERVIEW_MATCHES';
export const OVERVIEW_MATCHES = 'ligatool/modules/OVERVIEW_MATCHES';

const defaultState = {
  today: [],
  next: [],
  played: [],
};
// Reducer
export default function reducer(state = defaultState, action) {
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
