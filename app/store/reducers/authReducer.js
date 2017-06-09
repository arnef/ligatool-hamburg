// @flow
import { API_KEY, TOKEN, LOGOUT } from '../actions/types';
import { REHYDRATE } from 'redux-persist/constants';
import api from '../../api';

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
      state = { ...state, team: action.payload.data };
      break;

    case LOGOUT:
      // api.deleteHeader('Secret');
      state = { ...state, api_key: null, team: null };
      break;

    case REHYDRATE:
      if (
        action.payload &&
        action.payload.auth &&
        action.payload.auth.team &&
        action.payload.auth.team.token
      ) {
        // api.setHeader('Secret', action.payload.auth.team.token);
      }
      break;
  }

  return state;
}
