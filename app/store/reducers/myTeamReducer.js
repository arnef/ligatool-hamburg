// @flow
import { FULFILLED, QUERY_MY_TEAM_MATCHES, LOGOUT } from '../actions/types';

const initialState: MyTeamState = {
  next: [],
  played: []
};

export default function(
  state: MyTeamState = initialState,
  action: Action
): MyTeamState {
  switch (action.type) {
    case QUERY_MY_TEAM_MATCHES + FULFILLED: {
      state = { ...state, next: [], played: [] };
      if (action.payload.ok) {
        for (let match: Match of action.payload.data) {
          if (match.set_points && !match.score_unconfirmed) {
            state.played.push(match.id);
          } else {
            state.next.push(match.id);
          }
        }
      }
      return state;
    }
    case LOGOUT + FULFILLED: {
      state = { next: [], played: [] };
      return state;
    }
  }
  return state;
}
