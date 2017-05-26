// @flow
import { DIALOG_PLAYER } from './types';

export function showPlayerDialog(matchId: number, data: Array<Player>): Action {
  return {
    payload: { matchId, data },
    type: DIALOG_PLAYER,
  };
}

export function hidePlayerDialog(): Action {
  return {
    payload: false,
    type: DIALOG_PLAYER,
  };
}
