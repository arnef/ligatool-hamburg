// @flow
import {
  QUERY_MATCHES,
  GET_MATCH,
  SET_PLAYER,
  PUT_SETS,
  TOGGLE_D5,
  RESET_SETS,
  PENDING,
  FULFILLED,
} from './types';
import api, { MATCHES } from '../../api';
import { isAdminForMatch } from '../../Helper';

export function queryMatches(): Action {
  return {
    payload: api.get(MATCHES),
    type: QUERY_MATCHES,
  };
}

export function getMatch(id: number): Function {
  return (dispatch, getState) => {
    dispatch({ type: GET_MATCH + PENDING });
    api.get(MATCHES, { id }).then(resp => {
      handleMatchResponse(GET_MATCH + FULFILLED, resp, dispatch, getState);
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
    dispatch({ type: PUT_SETS + PENDING });
    api.put(`${MATCHES}/${matchId}`, { sets }).then(resp => {
      handleMatchResponse(PUT_SETS + FULFILLED, resp, dispatch, getState);
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
    const action = type === 0
      ? { score_suggest: true }
      : { score_unconfirmed: false };
    const body = { sets, ...action };
    dispatch({ type: PUT_SETS + PENDING });
    api.put(`${MATCHES}/${matchId}`, body).then(resp => {
      handleMatchResponse(PUT_SETS + FULFILLED, resp, dispatch, getState);
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
  if (resp.ok) {
    resp.data.is_admin = isAdminForMatch(resp.data, getState().auth);
  }
  dispatch({
    type,
    payload: resp,
  });
}
