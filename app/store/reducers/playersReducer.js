// @flow
import { FULFILLED, GET_PLAYER } from '../actions/types';

const initialState = {};

type State = {
  [id: string]: any,
};

export default function(state: State = initialState, action: Action) {
  switch (action.type) {
    case GET_PLAYER + FULFILLED:
      if (action.payload.ok) {
        state = { ...state, [action.payload.data.id]: action.payload.data };
      }
      break;
  }

  return state;
}
