// @flow
import { API_KEY, TOKEN, LOGOUT, SET_USER_TEAM } from './types';
import * as api from '../../api';
import store from '../index';
import { AsyncStorage } from 'react-native';

export function requestAPIKey(user: User): Action {
  const accesskey = store.getState().auth.api_key;
  if (accesskey != null) {
    return renewToken(accesskey);
  } else {
    return {
      payload: api.authenticate(user.username, user.password),
      type: API_KEY,
    };
  }
}

export function renewToken(apiKey: string): Action {
  return {
    payload: api.refreshAuthentication(apiKey),
    type: TOKEN,
  };
}

export function logout(): Action {
  return {
    payload: api.logout(),
    type: LOGOUT,
  };
}

export function setUserTeam(team: Team): Action {
  return {
    payload: team,
    type: SET_USER_TEAM,
  };
}
