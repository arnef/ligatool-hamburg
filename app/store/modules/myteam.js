// @flow
import * as LoadingActions from './loading';
import { LOGOUT } from './auth';
import type LogoutAction from './auth';
import * as api from '../../api';

// Type Definitions
type State = {
  next: Array<Match>,
  played: Array<Match>,
};

type Action = {
  type: MY_TEAM_MATCHES,
  payload:
    | {
        next: Array<Match>,
        played: Array<Match>,
      }
    | LogoutAction,
};

// Actions
export const MY_TEAM_MATCHES: MY_TEAM_MATCHES =
  'ligatool-hamburg/modules/MY_TEAM_MATCHES';

// Reducer
export default function reducer(
  state: State = {
    next: [],
    played: [],
  },
  action: Action,
): State {
  switch (action.type) {
    case MY_TEAM_MATCHES:
      state = { ...action.payload.data };
      break;

    case LOGOUT:
      state = { next: [], played: [] };
      break;
  }

  return state;
}

// Action Creators
export function getMyTeamMatches(): Function {
  return (dispatch, getState: Function) => {
    const team = getState().settings.team;
    if (team && team.id) {
      dispatch(LoadingActions.showLoading());
      api.getMatches(team.id).then(resp => {
        if (resp.ok) {
          dispatch({ type: MY_TEAM_MATCHES, payload: resp });
        }
        dispatch(LoadingActions.hideLoading(resp.error));
      });
    }
  };
}
