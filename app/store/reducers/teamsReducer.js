// @flow
import { GET_TEAM, QUERY_TEAM_MATCHES } from '../actions/types';

const initialState: TeamsState = {};

export default function(
  state: TeamsState = initialState,
  action: Action,
): TeamsState {
  switch (action.type) {
    case GET_TEAM:
      state = { ...state, [action.payload.data.id]: action.payload.data };

      return state;

    case QUERY_TEAM_MATCHES: {
      state = { ...state };
      const teamId = action.payload.params.id;

      if (state[teamId]) {
        state[teamId].matches = action.payload.data.map(match => match.id);
      }

      return state;
    }

    default:
      return state;
  }
}
