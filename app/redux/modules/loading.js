// @flow
// Type Definitions
type State = {
  modal: boolean,
  list: boolean,
  error: ?string,
};
type Action = { type: SHOW_LOADING_MODAL | HIDE_LOADING_MODAL };
// Actions
const SHOW_LOADING_MODAL: SHOW_LOADING_MODAL =
  'ligatool/modules/SHOW_LOADING_MODAL';
const HIDE_LOADING_MODAL: HIDE_LOADING_MODAL =
  'ligatool/modules/HIDE_LOADING_MODAL';
const SHOW_LOADING: SHOW_LOADING = 'ligatool/modules/SHOW_LOADING';
const HIDE_LOADING: HIDE_LOADING = 'ligatool/modules/HIDE_LOADING';
const SET_ERROR: SET_ERROR = 'ligatool/modules/loading/SET_ERROR';
export const APP_STATE_CHANGED = 'ligatool/modules/loading/APP_STATE_CHANGED';

// Reducer
export default function reducer(
  state: State = { modal: false, list: false },
  action: Action,
): State {
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
      state = { ...state, list: false };
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

export function error(message: string) {
  return { type: SET_ERROR, payload: message };
}

export function appState(state: string) {
  return { type: APP_STATE_CHANGED, payload: state };
}
