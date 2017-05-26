// @flow
import { API_KEY, TOKEN, FULFILLED, LOGOUT, PENDING } from '../actions/types';
import { DEFAULT_HEADERS } from 'apisauce';
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
    case API_KEY + FULFILLED:
      if (action.payload.ok) {
        state = { ...state, api_key: action.payload.data.access_key };
      }
      break;

    case TOKEN + FULFILLED:
      if (action.payload.ok) {
        state = { ...state, team: action.payload.data };
        api.setHeader('Secret', state.team.token);
      }
      break;

    case LOGOUT + FULFILLED:
      api.setHeaders(DEFAULT_HEADERS);
      state = { ...state, api_key: null, team: null };
      break;

    case REHYDRATE:
      if (
        action.payload &&
        action.payload.auth &&
        action.payload.auth.team &&
        action.payload.auth.team.token
      ) {
        api.setHeader('Secret', action.payload.auth.team.token);
      }
      break;
  }

  return state;
}
