// @flow
import * as LoadingActions from './loading';
import * as api from '../../api';

// Type Definitions
type State = {
  api_key: ?string,
  team: ?Team,
};

type ApiKeyAction = {
  type: API_KEY,
  payload: { access_key: string },
};

type TokenAction = {
  type: TOKEN,
  payload: { data: Team },
};

export type LogoutAction = {
  type: LOGOUT,
};

type Action = ApiKeyAction | TokenAction | LogoutAction;

const initialState: State = {
  api_key: null,
  team: null,
};

// Actions
const API_KEY: API_KEY = 'ligatool-hamburg/auth/API_KEY';
const TOKEN: TOKEN = 'ligatool-hamburg/auth/TOKEN';
export const LOGOUT: LOGOUT = 'ligatool-hamburg/auth/LOGOUT';

// Reducer
export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case API_KEY:
      state = { ...state, api_key: action.payload.data.access_key };
      break;

    case TOKEN:
      state = { ...state, team: action.payload.data };
      break;

    case LOGOUT:
      state = { api_key: null, team: null };
  }

  return state;
}

// Action Creators
export function renewToken(apiKey: string): Function {
  return dispatch => {
    dispatch(LoadingActions.showLoading());
    api.refreshAuthentication(apiKey).then(resp => {
      if (resp.ok) {
        dispatch({
          type: TOKEN,
          payload: resp,
        });
      }
      dispatch(LoadingActions.hideLoading(resp.error));
    });
  };
}

export function requestAPIKey(user: User): Function {
  return (dispatch, getState) => {
    const accessKey = getState().auth.api_key;
    if (!accessKey) {
      dispatch(renewToken(accessKey));
    } else {
      dispatch(LoadingActions.showLoading());
      api.authenticate(user).then(resp => {
        if (resp.ok) {
          dispatch({ type: API_KEY, payload: resp });
        }
        dispatch(LoadingActions.hideLoading(resp.error));
      });
    }
  };
}

export function logout(): Function {
  return dispatch => {
    dispatch(LoadingActions.showFullscreenLoading());
    api.logout().then(() => {
      dispatch({ type: LOGOUT });
      dispatch(LoadingActions.hideFullscreenLoading());
    });
  };
}
