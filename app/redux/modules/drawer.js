// @flow
// Type definitions
type State = {
  +[string]: { id: number, name: string, cup: boolean },
};

// Actions
export const GET_LEAGUES: GET_LEAGUES = 'ligatool/drawer/GET_LEAGUES';
const SET_LEAGUES: SET_LEAGUES = 'ligatool/drawer/SET_LEAGUES';

// Reducer
export default function reducer(state: State = {}, action): State {
  switch (action.type) {
    case SET_LEAGUES:
      state = { ...action.payload };
      break;
  }

  return state;
}

// Action Creators
export function setLeagues(payload: State) {
  return { type: SET_LEAGUES, payload };
}
