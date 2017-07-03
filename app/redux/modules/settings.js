// @flow
import { LOGOUT_DONE } from './auth';
const defaultColor = '#ef473a';

// Type Definitions
type State = {
  changed: boolean,
  color: string,
  notification: any,
  fcm_token: ?string,
  team: ?Team,
};

// Actions
export const CLEAR_CACHE: CLEAR_CACHE = 'ligatool/modules/CLEAR_CACHE';
export const CLEAR_CACHE_DONE: CLEAR_CACHE_DONE =
  'ligatool/modules/CLEAR_CACHE_DONE';
const SET_TEAM: SET_TEAM = 'ligatool/modules/SET_TEAM';

// Reducer
export default function reducer(
  state: State = {
    changed: false,
    color: defaultColor,
    notification: {},
    fcm_token: null,
    team: null,
  },
  action: Action,
): State {
  switch (action.type) {
    case LOGOUT_DONE:
      state = { ...state, color: defaultColor, team: null };
      break;
    case SET_TEAM:
      state = {
        ...state,
        color: action.payload.color || defaultColor,
        team: action.payload,
      };
      break;
  }
  return state;
}

// Action Creators
export function clearCache() {
  return { type: CLEAR_CACHE };
}

export function setTeam(team: Team) {
  return { type: SET_TEAM, payload: team };
}
