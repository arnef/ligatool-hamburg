// @flow
import { LOADING, LOADING_FULLSCREEN } from '../actions/types';

const initialState: LoadingState = {
  blocking: false,
  nonBlocking: false,
  error: null,
};

export default function(
  state: LoadingState = initialState,
  action: Action,
): LoadingState {
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
