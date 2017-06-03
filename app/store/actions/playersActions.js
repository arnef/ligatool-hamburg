// @flow

import { GET_PLAYER } from './types';
import api, { PLAYER } from '../../api';

export function getPlayer(id: number): Action {
  return {
    type: GET_PLAYER,
    payload: api.get(PLAYER, { id }),
  };
}
