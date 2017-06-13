// @flow
import { API_KEY, TOKEN, LOGOUT } from '../actions/types';
import { REHYDRATE } from 'redux-persist/constants';

const defaultState: AuthState = {
  api_key: null,
  team: null,
};

export default function(
  state: AuthState = defaultState,
  action: Action,
): AuthState {
  switch (action.type) {
    case API_KEY:
      state = { ...state, api_key: action.payload.data.access_key };
      break;

    case TOKEN:
      console.log(action);
      state = { ...state, team: action.payload.data };
      break;

    case LOGOUT:
      state = { ...state, api_key: null, team: null };
      break;
  }

  return state;
}
