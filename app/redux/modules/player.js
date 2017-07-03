// @flow
// Type Definitions
type State = {
  +[id: string]: any,
};

// Actions
export const GET_PLAYER: GET_PLAYER = 'ligatool/modules/player/GET_PLAYER';
export const GET_PLAYER_DONE: GET_PLAYER_DONE =
  'ligatool/modules/player/GET_PLAYER_DONE';

// Reducer
export default function reducer(state: State = {}, action): State {
  switch (action.type) {
    case GET_PLAYER_DONE:
      state = { ...state, [`${action.payload.id}`]: action.payload };
      break;
  }

  return state;
}

// Action Creators
export function getPlayer(id: string) {
  return { type: GET_PLAYER, payload: { id } };
}
