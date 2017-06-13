// @flow
// Type Definitions
type State = {
  blocking: boolean,
  nonBlocking: boolean,
  error: ?string,
};

type Action = {
  type: LOADING | LOADING_FULLSCREEN,
  payload: {
    loading: boolean,
    error: ?string,
  },
};

// Actions
const LOADING: LOADING = 'ligatool-hamburg/modules/LOADING';
const LOADING_FULLSCREEN: LOADING_FULLSCREEN =
  'ligatool-hamburg/modules/LOADING_FULLSCREEN';

// Reducer
export default function reducer(
  state: State = {
    blocking: false,
    nonBlocking: false,
    error: null,
  },
  action: Action,
): State {
  switch (action.type) {
    case LOADING:
      state = {
        ...state,
        nonBlocking: action.payload.loading,
        error: action.payload.error,
      };
      break;

    case LOADING_FULLSCREEN:
      state = {
        ...state,
        blocking: action.payload.loading,
        error: action.payload.error,
      };
      break;
  }

  return state;
}

// Action Creators
export function showLoading(): Action {
  return {
    type: LOADING,
    payload: { loading: true, error: null },
  };
}

export function showFullscreenLoading(): Action {
  return {
    type: LOADING_FULLSCREEN,
    payload: { loading: true, error: null },
  };
}

export function hideLoading(error: ?string): Action {
  return {
    type: LOADING,
    payload: { loading: false, error },
  };
}

export function hideFullscreenLoading(error: ?string): Action {
  return {
    type: LOADING_FULLSCREEN,
    payload: { loading: false, error },
  };
}
