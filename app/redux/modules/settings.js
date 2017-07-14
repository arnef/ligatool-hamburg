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
const TOGGLE_NOTIFICATION: TOGGLE_NOTIFICATION =
  'ligatool/settings/TOGGLE_NOTIFICATION';
const TOGGLE_GROUP_NOTIFICATION: TOGGLE_GROUP_NOTIFICATION =
  'ligatool/settings/TOGGLE_GROUP_NOTIFICATION';
const SYNCHRONIZED: SYNCHRONIZED = 'ligatool/settings/SYNCHRONIZED';

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
    case TOGGLE_NOTIFICATION:
      state = {
        ...state,
        changed: true,
        notification: {
          ...state.notification,
          [action.payload.key]: !state.notification[action.payload.key],
        },
      };
      break;
    case TOGGLE_GROUP_NOTIFICATION:
      state = {
        ...state,
        changed: true,
        notification: {
          ...state.notification,
          leagues: {
            ...state.notification.leagues,
            [action.payload.key]: !state.notification.leagues[
              action.payload.key
            ],
          },
        },
      };
      break;
    case SYNCHRONIZED:
      state = { ...state, changed: false };
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

export function toggleNotification(key: number | string) {
  return { type: TOGGLE_NOTIFICATION, payload: { key: `${key}` } };
}

export function toggleGroupNotification(key: number | string) {
  return { type: TOGGLE_GROUP_NOTIFICATION, payload: { key: `${key}` } };
}

export function synchronized() {
  return { type: SYNCHRONIZED };
}
