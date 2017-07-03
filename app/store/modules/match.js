// @flow
// import { OVERVIEW_MATCHES } from './overview';
import { MY_TEAM_MATCHES } from './myteam';
// Type Definitions
type State = { +[string]: Match };

type Action = {
  type: string,
  payload: any,
};

// Actions
export const GET_MATCHES = 'ligatool-hamburg/modules/GET_MATHCES';
const GET_MATCH: GET_MATCH = 'ligatool-hamburg/modules/GET_MATCH';
const TOGGLE_DOUBLES_5 = 'ligatool-hamburg/modules/TOGGLE_DOUBLES_5';

// Reducer
export default function reducer(state: State = {}, action: Action): State {
  switch (action.type) {
    case GET_MATCHES:
      state = merge(state, action.payload);
      break;
    case MY_TEAM_MATCHES:
      state = {
        ...merge(state, action.payload.data.next),
        ...merge(state, action.payload.data.played),
      };
      break;
    case GET_MATCH:
      state = {
        ...state,
        [`${action.payload.data.id}`]: {
          ...state[`${action.payload.data.id}`],
          ...action.payload.data,
        },
      };
      break;
    case TOGGLE_DOUBLES_5:
      state = {
        ...state,
        [`${action.payload.id}`]: {
          ...state[`${action.payload.id}`],
          type: action.payload.type,
        }, // TODO remove players from given sets
      };
      break;
  }
  return state;
}

// Action Creators
export function toggleDoubles() {}

// merge existing matches with new ones
function merge(state, matches) {
  for (let match of matches) {
    if (state[`${match.id}`]) {
      state = {
        ...state,
        [`${match.id}`]: { ...state[`${match.id}`], ...match },
      };
    } else {
      state = { ...state, [`${match.id}`]: match };
    }
  }

  return state;
}
