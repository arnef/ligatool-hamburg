// @flow 
import {
  FULFILLED,
  QUERY_MY_TEAM_MATCHES
} from '../actions/types';


const initialState: MyTeamState = {
  next: [],
  played: []
};

export default function (state: MyTeamState = initialState, action: Action): MyTeamState {

  switch (action.type) {
    case QUERY_MY_TEAM_MATCHES + FULFILLED: {
      state = { ...state };
      if (action.payload.ok) {
        for (let match: Match of action.payload.data) {
          if (match.set_points && !match.score_unconfirmed) {
            if (state.played.indexOf(match.id) === -1) {
              state.played.push(match.id);
            }
          } else {
            if (state.next.indexOf(match.id) === -1) {
              state.next.push(match.id);
            }
          }
        }
      }
      return state;
    }
  }
  return state;
}
