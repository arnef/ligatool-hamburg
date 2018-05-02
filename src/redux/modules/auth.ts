// Actions
export const LOGOUT = 'ligatool/modules/LOGOUT';
export const LOGOUT_DONE = 'ligatool/modules/LOGOUT_DONE';
export const LOGIN = 'ligatool/modules/LOGIN';
const SET_API_KEY = 'ligatool/modules/SET_API_KEY';
const SET_TOKEN = 'ligatool/modules/auth/SET_TOKEN';

const defaultState = { api_key: null, team: null };
// Reducer
export default function reducer(state = defaultState, action) {
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
export function logout() {
  return { type: LOGOUT };
}

export function login(user, next) {
  return { type: LOGIN, payload: user, next };
}

export function setApiKey(key) {
  return { type: SET_API_KEY, payload: key };
}

export function setToken(token) {
  return { type: SET_TOKEN, payload: token };
}

export const accessForTeams = state =>
  get(state).team && get(state).team.ids ? get(state).team.ids : [];

const get = state => state.auth;
