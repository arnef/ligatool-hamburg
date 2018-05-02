// Actions
const SHOW_LOADING_MODAL = 'ligatool/modules/SHOW_LOADING_MODAL';
const HIDE_LOADING_MODAL = 'ligatool/modules/HIDE_LOADING_MODAL';
const SHOW_LOADING = 'ligatool/modules/SHOW_LOADING';
const HIDE_LOADING = 'ligatool/modules/HIDE_LOADING';
const SET_ERROR = 'ligatool/modules/loading/SET_ERROR';
export const APP_STATE_CHANGED = 'ligatool/modules/loading/APP_STATE_CHANGED';

const defaultState = { modal: false, list: false };
// Reducer
export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case SHOW_LOADING_MODAL:
      state = { ...state, modal: true };
      break;
    case HIDE_LOADING_MODAL:
      state = { ...state, modal: false };
      break;
    case SHOW_LOADING:
      state = { ...state, list: true, error: null };
      break;
    case HIDE_LOADING:
      state = { ...state, list: false, modal: false };
      break;
    case SET_ERROR:
      state = { ...state, error: action.payload };
  }

  return state;
}

// Action Creators
export function showModal() {
  return { type: SHOW_LOADING_MODAL };
}

export function hideModal() {
  return { type: HIDE_LOADING_MODAL };
}

export function show() {
  return { type: SHOW_LOADING };
}

export function hide() {
  return { type: HIDE_LOADING };
}

export function error(message) {
  return { type: SET_ERROR, payload: message };
}

export function appState(state) {
  return { type: APP_STATE_CHANGED, payload: state };
}
