// @flow
import {
  PUT_SETS,
  LOGOUT,
  LOADING,
  LOADING_FULLSCREEN,
  UPDATE_FCM_TOKEN,
  PUT_NOTIFICATION,
  CLEAR_IMAGE_CACHE,
} from '../actions/types';
import { NavigationActions } from 'react-navigation';

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
