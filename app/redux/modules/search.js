// Actions
const SET_RESULTS = 'ligatool/search/SET_RESULTS';
const SET_MESSAGE = 'ligatool/search/SET_MESSAGE';
// const SET_QUERY = 'ligatool/search/SET_QUERY';
export const SEARCH = 'ligatool/searc/SEARCH';

// Reducer
const defaultState = { results: null, message: null };
export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case SEARCH:
      state = { ...defaultState };
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
export function setResult(results) {
  return { type: SET_RESULTS, payload: results };
}
export function setMessage(message) {
  return { type: SET_MESSAGE, payload: message };
}

export function search(query) {
  return { type: SEARCH, payload: query };
}
