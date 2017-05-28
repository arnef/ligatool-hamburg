import { GET_PLAYER } from './types';
import * as api from '../../api';

export function getPlayer(id: number): Action {
  return {
    type: GET_PLAYER,
    payload: api.getPlayer(id),
  };
}
