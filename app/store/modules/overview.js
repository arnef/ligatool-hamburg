// @flow
import * as LoadingActions from './loading';
import * as api from '../../api';

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
  'ligatool-hamburg/overview/OVERVIEW_MATCHES';

// Reducer
export default function reducer(
  state: State = { today: [], next: [], played: [] },
  action: Action,
): State {
  switch (action.type) {
    case OVERVIEW_MATCHES:
      state = { ...action.payload.data };
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
        dispatch({ type: OVERVIEW_MATCHES, payload: resp });
      }
      dispatch(LoadingActions.hideLoading(resp.error));
    });
  };
}
