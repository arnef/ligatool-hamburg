// @flow
import {
  QUERY_MATCHES,
  GET_MATCH,
  SET_PLAYER,
  PUT_SETS,
  TOGGLE_D5,
  RESET_SETS,
  LOADING_FULLSCREEN,
  LOADING,
} from './types';
import api, { MATCHES } from '../../api';
import { isAdminForMatch } from '../../Helper';

export function queryMatches(): Function {
  return dispatch => {
    dispatch({ type: LOADING, payload: { loading: true } });
    api
      .get(MATCHES)
      .then(resp => {
        dispatch({ type: LOADING, payload: { loading: false } });
        dispatch({
          type: QUERY_MATCHES,
          payload: resp,
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

export function getMatch(id: number): Function {
  return (dispatch, getState) => {
    dispatch({ type: LOADING, payload: { loading: true } });
    api
      .get(`${MATCHES}/${id}`)
      .then(resp => {
        dispatch({ type: LOADING, payload: { loading: false } });
        handleMatchResponse(GET_MATCH, resp, dispatch, getState);
      })
      .catch(ex => {
        dispatch({
          type: LOADING,
          payload: { loading: false, error: ex.message },
        });
      });
  };
}

export function setPlayer(
  id: number,
  team: Team,
  player: Player,
  setsIdx: Array<number>,
): Action {
  return {
    payload: { id, player, setsIdx, team },
    type: SET_PLAYER,
  };
}

export function updateSets(matchId: number, sets: any): Function {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_FULLSCREEN, payload: { loading: true } });
    api.put(`${MATCHES}/${matchId}`, { sets }).then(resp => {
      dispatch({ type: LOADING_FULLSCREEN, payload: { loading: false } });
      handleMatchResponse(PUT_SETS, resp, dispatch, getState);
    });
  };
}

export function resetSets(matchId: number, setsIdx: Array<number>): Action {
  return {
    type: RESET_SETS,
    payload: { id: matchId, setsIdx },
  };
}

export function suggestScore(
  matchId: number,
  sets: any,
  type: number,
): Function {
  return (dispatch, getState) => {
    if (type === 1) {
      throw 'Wrong type for suggestScore action, must be 0 or 2';
    }
    const action =
      type === 0 ? { score_suggest: true } : { score_unconfirmed: false };
    const body = { sets, ...action };
    dispatch({ type: LOADING_FULLSCREEN, payload: { loading: true } });
    api
      .put(`${MATCHES}/${matchId}`, body)
      .then(resp => {
        dispatch({ type: LOADING_FULLSCREEN, payload: { loading: false } });
        handleMatchResponse(PUT_SETS, resp, dispatch, getState);
      })
      .catch(ex => {
        dispatch({
          type: LOADING_FULLSCREEN,
          payload: { loading: false, error: ex.message },
        });
      });
  };
}

export function toggleMatchType(
  id: number,
  setsIdx: Array<number>,
  type: string,
): Action {
  return {
    payload: { id, idx: setsIdx, type },
    type: TOGGLE_D5,
  };
}

function handleMatchResponse(
  type: string,
  resp: any | { ok: boolean, data: Match },
  dispatch: Function,
  getState: Function,
) {
  resp.data.is_admin = isAdminForMatch(resp.data, getState().auth);

  dispatch({
    type,
    payload: resp,
  });
}
