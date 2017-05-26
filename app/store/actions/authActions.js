// @flow
import { API_KEY, TOKEN, LOGOUT, SET_USER_TEAM } from './types';
import api, { USER_AUTH, USER_AUTH_REFRESH } from '../../api';
import store from '../index';
import { AsyncStorage } from 'react-native';

export function requestAPIKey(user: User): Action {
  const accesskey = store.getState().auth.api_key;
  if (accesskey != null) {
    return renewToken(accesskey);
  } else {
    return {
      payload: api.post(USER_AUTH, user),
      type: API_KEY,
    };
  }
}

export function renewToken(apiKey: string): Action {
  return {
    payload: api.post(USER_AUTH_REFRESH, { access_key: apiKey }),
    type: TOKEN,
  };
}

export function logout(): Action {
  return {
    payload: api.delete(USER_AUTH),
    type: LOGOUT,
  };
}

export function setUserTeam(team: Team): Action {
  return {
    payload: team,
    type: SET_USER_TEAM,
  };
}
