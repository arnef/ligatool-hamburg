// @flow
import { API_KEY, TOKEN, LOGOUT, SET_USER_TEAM } from './types';
import api, { USER_AUTH, USER_AUTH_REFRESH } from '../../api';

export function requestAPIKey(user: User): Function {
  return (dispatch, getState) => {
    const accesskey = getState().auth.api_key;
    if (accesskey !== null) {
      dispatch(renewToken(accesskey));
    } else {
      dispatch({
        payload: api.post(USER_AUTH, user),
        type: API_KEY,
      });
    }
  };
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
