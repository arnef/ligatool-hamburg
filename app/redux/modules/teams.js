// @flow
// Type Definition
type State = {
  +[string]: Team,
};

type TeamAction = {
  type: GET_TEAM_DONE,
  payload: Team,
};

type GetAction = {
  type: GET_TEAM | GET_TEAM_MATCHES,
  payload: { id: number | string },
};

type Action = GetAction | TeamAction;

// Actions
export const GET_TEAM: GET_TEAM = 'ligatool/modules/GET_TEAM';
export const GET_TEAM_DONE: GET_TEAM_DONE = 'ligatool/modules/GET_TEAM_DONE';
export const GET_TEAM_MATCHES: GET_TEAM_MATCHES =
  'ligatool/modules_GET_TEAM_MATCHES';
export const GET_TEAM_MATCHES_DONE: GET_TEAM_MATCHES_DONE =
  'ligatool/modules_GET_TEAM_MATCHES_DONE';

// Reducer
export default function reducer(state: State = {}, action: Action): State {
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
export function getTeam(id: number | string): GetAction {
  return { type: GET_TEAM, payload: { id } };
}

export function getMatches(id: number | string): GetAction {
  return { type: GET_TEAM_MATCHES, payload: { id } };
}
