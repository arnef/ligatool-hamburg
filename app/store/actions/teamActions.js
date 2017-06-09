// @flow
import {
  GET_TEAM,
  QUERY_MY_TEAM_MATCHES,
  QUERY_TEAM_MATCHES,
  LOADING,
} from './types';
import api, { TEAMS, MATCHES } from '../../api';

// queryTeamMatches und getTeamMatches zu einer function machen?
export function queryTeamMatches(): Function {
  return (dispatch, getState) => {
    const team: Team = getState().settings.team;
    if (team && team.id) {
      dispatch({ type: LOADING, payload: { loading: true } });

      api
        .get(`${TEAMS}/${team.id}${MATCHES}`)
        .then(resp => {
          dispatch({ type: LOADING, payload: { loading: false } });
          dispatch({
            type: QUERY_MY_TEAM_MATCHES,
            payload: resp,
          });
        })
        .catch(ex => {
          dispatch({ type: LOADING, payload: { loading: false, error: ex } });
        });
    } else {
      dispatch({
        type: 'IGNORE',
      });
    }
  };
}

export function getTeam(id: number): Function {
  return dispatch => {
    dispatch({ type: LOADING, payload: { loading: true } });
    api
      .get(`${TEAMS}/${id}`)
      .then(resp => {
        dispatch({ type: LOADING, payload: { loading: false } });
        dispatch({
          type: GET_TEAM,
          payload: resp,
        });
      })
      .catch(ex => {
        dispatch({ type: LOADING, payload: { loading: false, error: ex } });
      });
  };
}

export function getTeamMatches(id: number): Function {
  return dispatch => {
    dispatch({ type: LOADING, payload: { loading: true } });
    api
      .get(`${TEAMS}/${id}${MATCHES}`)
      .then(resp => {
        dispatch({ type: LOADING, payload: { loading: false } });
        dispatch({
          type: QUERY_TEAM_MATCHES,
          payload: { ...resp, params: { id } },
        });
      })
      .catch(ex => {
        dispatch({
          type: LOADING,
          payload: { loading: false, error: ex.message },
        });
      });
  };
}
