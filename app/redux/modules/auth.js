// @flow
// Type Definitions
type State = {
  api_key: ?string,
  team: ?Team,
};

type LogoutAction = {
  type: LOGOUT | LOGOUT_DONE,
};

type Action = LogoutAction;

// Actions
export const LOGOUT: LOGOUT = 'ligatool/modules/LOGOUT';
export const LOGOUT_DONE: LOGOUT_DONE = 'ligatool/modules/LOGOUT_DONE';
export const LOGIN: LOGIN = 'ligatool/modules/LOGIN';
const SET_API_KEY: SET_API_KEY = 'ligatool/modules/SET_API_KEY';
const SET_TOKEN: SET_TOKEN = 'ligatool/modules/auth/SET_TOKEN';

// Reducer
export default function reducer(
  state: State = { api_key: null, team: null },
  action: Action,
): State {
  switch (action.type) {
    case LOGOUT_DONE:
      state = { api_key: null, team: null };
      break;
    case SET_API_KEY:
      state = { ...state, api_key: action.payload };
      break;
    case SET_TOKEN:
      state = { ...state, team: action.payload };
      break;
  }
  return state;
}

// Action Creators
export function logout(): LogoutAction {
  return { type: LOGOUT };
}

export function login(
  user: { username: string, password: string },
  next: ?string,
): Action {
  return { type: LOGIN, payload: user, next };
}

export function setApiKey(key: string): Action {
  return { type: SET_API_KEY, payload: key };
}

export function setToken(token: {
  expires: number,
  ids: Array<string>,
  token: string,
}): Action {
  return { type: SET_TOKEN, payload: token };
}
