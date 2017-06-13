// @flow
import {
  API_KEY,
  TOKEN,
  LOGOUT,
  SET_USER_TEAM,
  LOADING,
  LOADING_FULLSCREEN,
} from './types';
import api, { USER_AUTH, USER_AUTH_REFRESH } from '../../api';

export function requestAPIKey(user: User): Function {
  return (dispatch, getState) => {
    const accesskey = getState().auth.api_key;
    if (accesskey !== null) {
      dispatch(renewToken(accesskey));
    } else {
      dispatch({ type: LOADING, payload: { loading: true } });
      api
        .post(USER_AUTH, user)
        .then(resp => {
          // dispatch({ type: LOADING, payload: { loading: false } });
          dispatch({ type: API_KEY, payload: resp });
        })
        .catch(ex => {
          dispatch({
            type: LOADING,
            payload: { loading: false, error: ex.message },
          });
        });
    }
  };
}

export function renewToken(apiKey: string): Function {
  console.log(apiKey);
  return dispatch => {
    dispatch({ type: LOADING, payload: { loading: true } });
    api
      .post(USER_AUTH_REFRESH, { access_key: apiKey })
      .then(resp => {
        dispatch({ type: LOADING, payload: { loading: false } });
        dispatch({ type: TOKEN, payload: resp });
        // set api headers
        api.defaults.headers.common['Secret'] = resp.data.token;
      })
      .catch(ex => {
        dispatch({
          type: LOADING,
          payload: { loading: false, error: ex.message },
        });
      });
  };
}

export function logout(): Function {
  return dispatch => {
    delete api.defaults.headers.common['Secret'];
    dispatch({ type: LOADING_FULLSCREEN, payload: { loading: true } });
    api
      .delete(USER_AUTH)
      .then(() => {
        dispatch({ type: LOADING_FULLSCREEN, payload: { loading: false } });
        dispatch({ type: LOGOUT });
      })
      .catch(() => {
        dispatch({ type: LOADING_FULLSCREEN, payload: { loading: false } });
        dispatch({ type: LOGOUT });
      });
  };
}

export function setUserTeam(team: Team): Action {
  return {
    payload: team,
    type: SET_USER_TEAM,
  };
}
