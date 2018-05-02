// Actions
export const GET_MY_TEAM_MATCHES = 'ligatool/modules/GET_MY_TEAM_MATCHES';
export const MY_TEAM_MATCHES = 'ligatool/modules/MY_TEAM_MATCHES';

const defaultState = {
  next: [],
  played: [],
};
// Reducer
export default function reducer(state = defaultState, action) {
  const { type, payload } = action;
  switch (type) {
    case MY_TEAM_MATCHES:
      return { ...state, ...payload };

    case 'user/SET_ACTIVE_TEAM':
      return defaultState;

    default:
      return state;
  }
}

// Action Creators
export function getMatches() {
  return { type: GET_MY_TEAM_MATCHES };
}
