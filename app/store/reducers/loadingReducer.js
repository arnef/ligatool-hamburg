// @flow
import {
  PUT_SETS,
  LOGOUT,
  PENDING,
  FULFILLED,
  TOKEN,
  UPDATE_FCM_TOKEN,
  PUT_NOTIFICATION
} from '../actions/types';

const initialState: LoadingState = {
  blocking: false,
  nonBlocking: false,
  error: null
};

export default function(
  state: LoadingState = initialState,
  action: Action
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
    case TOKEN + PENDING:
      return { ...state, blocking: true, error: null };

    case LOGOUT + FULFILLED:
    case PUT_SETS + FULFILLED:
    case TOKEN + FULFILLED:
      return {
        ...state,
        blocking: false,
        error: action.type === LOGOUT + FULFILLED
          ? null
          : action.payload.problem
      };

    default:
      if (action.type.indexOf(PENDING) !== -1 && !state.blocking) {
        console.tron.log(action.type + ' true');
        state = { ...state, nonBlocking: true, error: null };
      }
      if (action.type.indexOf(FULFILLED) !== -1) {
        console.tron.log(action.type + ' false');
        state = {
          ...state,
          nonBlocking: false,
          error: action.payload ? action.payload.problem : null
        };
      }
      return state;
  }
}
