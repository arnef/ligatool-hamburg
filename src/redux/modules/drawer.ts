// Actions
export const GET_LEAGUES = 'ligatool/drawer/GET_LEAGUES';
const SET_LEAGUES = 'ligatool/drawer/SET_LEAGUES';

const defaultState = {};
// Reducer
export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case SET_LEAGUES:
      state = { ...action.payload };
      break;
  }

  return state;
}

// Action Creators
export function setLeagues(payload) {
  return { type: SET_LEAGUES, payload };
}
