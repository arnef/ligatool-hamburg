// @flow
import { GET_MATCHES } from './match';
import * as LoadingActions from './loading';
import * as api from '../../api';
import { compareDays } from '../../Helper';

type State = {
  today: Array<number>,
  next: Array<number>,
  played: Array<number>,
};

type Action = {
  type: string,
  payload: {
    today: Array<Match>,
    next: Array<Match>,
    played: Array<Match>,
  },
};

// Actions
export const OVERVIEW_MATCHES: OVERVIEW_MATCHES =
  'ligatool-hamburg/modules/OVERVIEW_MATCHES';

// Reducer
export default function reducer(
  state: State = { today: [], next: [], played: [] },
  action: Action,
): State {
  switch (action.type) {
    case OVERVIEW_MATCHES:
      state = { ...action.payload };
      break;
  }

  return state;
}

// Action Creators
export function getMatches(): Function {
  return dispatch => {
    dispatch(LoadingActions.showLoading());
    api.getMatches().then(resp => {
      if (resp.ok) {
        dispatch({ type: GET_MATCHES, payload: resp.data });
      }
      const now = new Date().getTime();
      const today = [];
      const next = [];
      const played = [];
      const matches: Array<Match> = resp.data;

      for (let match: Match of matches) {
        if (match.date_confirmed) {
          const diff: number = compareDays(match.datetime, now);
          if ((match.live && diff > -2) || diff === 0) {
            today.push(`${match.id}`);
          } else if (match.set_points) {
            played.push(`${match.id}`);
          } else if (diff > 0) {
            next.push(`${match.id}`);
          }
        }
      }
      dispatch({ type: OVERVIEW_MATCHES, payload: { today, next, played } });
      dispatch(LoadingActions.hideLoading(resp.error));
    });
  };
}
