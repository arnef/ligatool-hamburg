// Actions
export const GET_PLAYER = 'ligatool/modules/player/GET_PLAYER';
export const GET_PLAYER_DONE = 'ligatool/modules/player/GET_PLAYER_DONE';

const defaultState = {};
// Reducer
export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case GET_PLAYER_DONE:
      state = { ...state, [`${action.payload.data.id}`]: action.payload };
      break;
  }

  return state;
}

// Action Creators
export function getPlayer(id) {
  return { type: GET_PLAYER, payload: { id } };
}
