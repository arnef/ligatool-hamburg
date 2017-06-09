// @flow
import { GET_PLAYER } from '../actions/types';

const initialState = {};

type State = {
  [id: string]: any,
};

export default function(state: State = initialState, action: Action) {
  switch (action.type) {
    case GET_PLAYER:
      state = { ...state, [action.payload.data.id]: action.payload.data };
      break;
  }

  return state;
}
