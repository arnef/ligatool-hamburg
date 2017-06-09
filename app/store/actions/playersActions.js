// @flow

import { GET_PLAYER, LOADING } from './types';
import api, { PLAYER } from '../../api';

export function getPlayer(id: number): Function {
  return dispatch => {
    dispatch({ type: LOADING, payload: { loading: true } });
    api
      .get(`${PLAYER}/${id}`)
      .then(resp => {
        dispatch({ type: LOADING, payload: { loading: false } });
        dispatch({
          type: GET_PLAYER,
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
  // return {
  //   type: GET_PLAYER,
  //   payload: api.get(PLAYER, { id }),
  // };
}
