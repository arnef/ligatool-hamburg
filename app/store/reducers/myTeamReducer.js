// @flow
import { QUERY_MY_TEAM_MATCHES, LOGOUT } from '../actions/types';

const initialState: MyTeamState = {
  next: [],
  played: [],
};

export default function(
  state: MyTeamState = initialState,
  action: Action,
): MyTeamState {
  switch (action.type) {
    case QUERY_MY_TEAM_MATCHES: {
      state = { ...state, next: [], played: [] };

      for (let match: Match of action.payload.data) {
        if (match.set_points && !match.score_unconfirmed) {
          state.played.push(match.id);
        } else {
          state.next.push(match.id);
        }
      }

      return state;
    }
    case LOGOUT: {
      state = { next: [], played: [] };
      return state;
    }
  }
  return state;
}
