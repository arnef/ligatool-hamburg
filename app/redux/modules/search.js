// @flow

// Actions
const SET_RESULTS: SET_RESULTS = 'ligatool/search/SET_RESULTS';
const SET_MESSAGE: SET_MESSAGE = 'ligatool/search/SET_MESSAGE';
const SET_QUERY: SET_QUERY = 'ligatool/search/SET_QUERY';
export const SEARCH: SEARCH = 'ligatool/searc/SEARCH';

// Reducer
const initialState = { results: null, message: null };
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH:
      state = { ...initialState };
      break;
    case SET_RESULTS:
      state = { ...state, results: action.payload };
      break;
    case SET_MESSAGE:
      state = { ...state, message: action.payload };
      break;
  }
  return state;
}

// Action Creators
export function setResult(results: Array<any>) {
  return { type: SET_RESULTS, payload: results };
}
export function setMessage(message: string) {
  return { type: SET_MESSAGE, payload: message };
}

export function search(query: string) {
  return { type: SEARCH, payload: query };
}
