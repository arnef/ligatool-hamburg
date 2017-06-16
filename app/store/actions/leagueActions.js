// @flow
import {
  QUERY_RANKINGS,
  GET_LEAGUE,
  QUERY_LEAGUE_MATCHES,
  GET_PLAYERS_STATS,
  LOADING,
} from './types';
import api, { LEAGUES, MATCHES, PLAYER } from '../../api';

export function getRankings(): Function {
  return dispatch => {
    dispatch({ type: LOADING, payload: { loading: true } });
    api
      .get(LEAGUES)
      .then(resp => {
        dispatch({ type: LOADING, payload: { loading: false } });
        dispatch({ type: QUERY_RANKINGS, payload: resp });
      })
      .catch(ex => {
        dispatch({
          type: LOADING,
          payload: { loading: false, error: ex.message },
        });
      });
  };
}

export function getLeague(id: number): Function {
  return dispatch => {
    dispatch({ type: LOADING, payload: { loading: true } });
    api
      .get(`${LEAGUES}/${id}`)
      .then(resp => {
        dispatch({ type: LOADING, payload: { loading: false } });
        dispatch({ type: GET_LEAGUE, payload: resp });
      })
      .catch(ex => {
        dispatch({
          type: LOADING,
          payload: { loading: false, error: ex.message },
        });
      });
  };
}

export function getLeagueMatches(id: number): Function {
  return dispatch => {
    dispatch({ type: LOADING, payload: { loading: true } });
    api
      .get(`${LEAGUES}/${id}${MATCHES}`)
      .then(resp => {
        dispatch({ type: LOADING, payload: { loading: false } });
        dispatch({
          type: QUERY_LEAGUE_MATCHES,
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

export function getPlayersStats(id: number): Function {
  return dispatch => {
    dispatch({ type: LOADING, payload: { loading: true } });
    api
      .get(`${LEAGUES}/${id}${PLAYER}`)
      .then(resp => {
        dispatch({ type: LOADING, payload: { loading: false } });
        dispatch({
          type: GET_PLAYERS_STATS,
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
