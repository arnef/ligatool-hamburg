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
import * as api from '../../api';

export function queryMatches(): Action {
  return {
    payload: api.getMatches(),
    type: QUERY_MATCHES,
  };
}

export function getMatch(id: number): Action {
  return {
    payload: api.getMatch(id),
    type: GET_MATCH,
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

export function updateSets(matchId: number, sets: any): Action {
  return {
    payload: api.updateMatch(matchId, { sets }),
    type: PUT_SETS,
  };
}

export function resetSets(matchId: number, setsIdx: Array<number>): Action {
  return {
    type: RESET_SETS,
    payload: { id: matchId, setsIdx },
  };
}

export const suggestScore = (matchId: number, sets: any, type: number) => {
  if (type === 1) {
    throw 'Wrong type for suggestScore action, must be 0 or 2';
  }
  const action = type === 0
    ? { score_suggest: true }
    : { score_unconfirmed: false };
  const body = { sets, ...action };

  return {
    payload: api.updateMatch(matchId, body),
    type: PUT_SETS,
  };
};

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
