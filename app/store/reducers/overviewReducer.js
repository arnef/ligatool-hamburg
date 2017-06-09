// @flow
import { QUERY_MATCHES } from '../actions/types';
import { compareDays } from '../../Helper';

const initialState: OverviewState = {
  today: [],
  next: [],
  played: [],
};

export default function(
  state: OverviewState = initialState,
  action: Action,
): OverviewState {
  switch (action.type) {
    case QUERY_MATCHES: {
      const now = new Date().getTime();
      state = { ...state, today: [], next: [], played: [] };
      for (let match: Match of action.payload.data) {
        if (match.date_confirmed) {
          const diff: number = compareDays(match.datetime, now);

          if ((match.live && diff > -2) || diff === 0) {
            state.today.push(match.id);
          } else if (diff < 0 && match.set_points) {
            state.played.push(match.id);
          } else if (diff > 0) {
            if (match.set_points) {
              state.played.push(match.id);
            } else {
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
