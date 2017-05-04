// @flow
import {
  PENDING,
  FULFILLED,
  DIALOG_PLAYER,
  API_KEY,
  TOKEN,
  QUERY_RANKINGS,
  SHOW_LOGIN
} from '../actions/types';

const defaultState: DialogState = {
    login: {
        loading: false,
        visible: false
    },
    player: {
        data: [],
        visible: false
    }
};

export default (state: DialogState = defaultState, action: Action) => {
  switch (action.type) {

    case DIALOG_PLAYER: {
      if (action.payload) {
        state = { ...state, player: { data: action.payload.data, visible: true } };
      } else {
        state = { ...state, player: { data: [], visible: false } };
      }

      return state;
    }

    case SHOW_LOGIN: {
      state = { ...state, login: { loading: false, visible: action.payload } };

      return state;
    }

    case QUERY_RANKINGS + PENDING: {
      state = { ...state };
      state.login.loading = true;

      return state;
    }

    case QUERY_RANKINGS + FULFILLED: {
      state = { ...state };
      state.login.loading = false;

      return state;
    }

    case API_KEY + PENDING: {
      state = { ...state };
      state.login.loading = true;

      return state;
    }

    case API_KEY + FULFILLED: {
      if (!action.payload.ok) {
        state = { ...state, login: { loading: false }, visible: true };
      }

      return state;
    }

    case TOKEN + FULFILLED: {
      if (action.payload.ok) {
        state = { ...state, login: { loading: false, visible: false } };
      } else {
        state = { ...state, login: { loading: false, visible: action.payload.status !== 200 } };
      }

      return state;
    }
  }

  return state;
}
