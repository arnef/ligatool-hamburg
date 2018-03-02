// Actions
export const GET_TEAM = 'ligatool/modules/GET_TEAM';
export const GET_TEAM_DONE = 'ligatool/modules/GET_TEAM_DONE';
export const GET_TEAM_MATCHES = 'ligatool/modules_GET_TEAM_MATCHES';
export const GET_TEAM_MATCHES_DONE = 'ligatool/modules_GET_TEAM_MATCHES_DONE';

const defaultState = {};
// Reducer
export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case GET_TEAM_DONE:
      state = { ...state, [action.payload.id]: action.payload };
      break;
    case GET_TEAM_MATCHES_DONE:
      state = {
        ...state,
        [action.payload.id]: { ...state[action.payload.id], ...action.payload },
      };
      break;
  }
  return state;
}

// Action Creators
export function getTeam(id) {
  return { type: GET_TEAM, payload: { id } };
}

export function getMatches(id) {
  return { type: GET_TEAM_MATCHES, payload: { id } };
}
