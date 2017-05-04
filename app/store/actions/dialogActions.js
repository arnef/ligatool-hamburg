// @flow
import { DIALOG_SCORE, DIALOG_PLAYER } from './types';

export function showScoreDialog(): Action {
  return {
    payload: true,
    type: DIALOG_SCORE
  };
}

export function hideScoreDialog(): Action {
  return {
    payload: false,
    type: DIALOG_SCORE
  };
}

export function showPlayerDialog(matchId: number, data: Array<Player>): Action {
  return {
    payload: { matchId, data },
    type: DIALOG_PLAYER
  };
}

export function hidePlayerDialog(): Action {
  return {
    payload: false,
    type: DIALOG_PLAYER
  };
}
