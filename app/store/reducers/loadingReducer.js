// @flow
import {
  PUT_SETS,
  LOGOUT,
  PENDING,
  FULFILLED
} from '../actions/types';

const initialState: LoadingState = {
  blocking: false,
  nonBlocking: false
};

export default function (state: LoadingState = initialState, action: Action): LoadingState {

  switch (action.type) {
  // case LOGOUT + PENDING:
  // case PUT_SETS + PENDING:
  //   return { ...state, blocking: true };
  //
  //
  // case LOGOUT + FULFILLED:
  // case PUT_SETS + FULFILLED:
  //   return { ...state, blocking: false };

  // default:
  //   if (action.type.indexOf(PENDING) !== -1 && !state.blocking) {
  //     state = { ...state, nonBlocking: true };
  //   }
  //   if (action.type.indexOf(FULFILLED) !== -1) {
  //     state = { ...state, nonBlocking: false };
  //   }
  //   return state;
  }
  return state;
}
