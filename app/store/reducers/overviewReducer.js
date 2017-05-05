// @flow
import { FULFILLED, QUERY_MATCHES } from '../actions/types';
import { compareDays } from '../../Helper';

const initialState: OverviewState = {
  today: [],
  next: [],
  played: []
};

export default function(
  state: OverviewState = initialState,
  action: Action
): OverviewState {
  switch (action.type) {
    case QUERY_MATCHES + FULFILLED: {
      if (action.payload.ok) {
        const now = new Date().getTime();
        state = { ...state };
        for (let match: Match of action.payload.data) {
          if (match.date_confirmed) {
            const diff: number = compareDays(match.datetime, now);

            if ((match.live && diff > -2) || diff === 0) {
              if (state.today.indexOf(match.id) === -1) {
                state.today.push(match.id);
              }
            } else if (diff < 0 && match.set_points) {
              if (state.played.indexOf(match.id) === -1) {
                state.played.push(match.id);
              }
            } else if (diff > 0) {
              if (match.set_points) {
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
        }
      }

      return state;
    }
  }

  return state;
}
