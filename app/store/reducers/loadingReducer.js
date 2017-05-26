// @flow
import {
  PUT_SETS,
  LOGOUT,
  PENDING,
  FULFILLED,
  TOKEN,
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
    case UPDATE_FCM_TOKEN + PENDING:
    case UPDATE_FCM_TOKEN + FULFILLED:
    case PUT_NOTIFICATION + PENDING:
    case PUT_NOTIFICATION + FULFILLED:
      // do in background
      return state;
    case LOGOUT + PENDING:
    case PUT_SETS + PENDING:
    case CLEAR_IMAGE_CACHE + PENDING:
      return { ...state, blocking: true, error: null };

    case LOGOUT + FULFILLED:
    case PUT_SETS + FULFILLED:
    case CLEAR_IMAGE_CACHE + FULFILLED:
      return {
        ...state,
        blocking: false,
        error: action.type === LOGOUT + FULFILLED || !action.payload
          ? null
          : action.payload.problem,
      };
    case NavigationActions.NAVIGATE:
    case NavigationActions.BACK:
      return { ...state, error: null };

    default:
      if (action.type.indexOf(PENDING) !== -1 && !state.blocking) {
        state = { ...state, nonBlocking: true, error: null };
      }
      if (action.type.indexOf(FULFILLED) !== -1) {
        state = {
          ...state,
          nonBlocking: false,
          error: action.payload ? action.payload.problem : null,
        };
      }
      return state;
  }
}
