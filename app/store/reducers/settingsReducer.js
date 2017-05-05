// @flow
import {
  SET_NOTIFICATION,
  SET_GROUP_NOTIFICATION,
  SET_USER_TEAM,
  PUT_NOTIFICATION,
  LOGOUT,
  FULFILLED,
  UPDATE_FCM_TOKEN
} from '../actions/types';

const defaultColor = '#ef473a';

const defaultState: SettingState = {
  changed: false,
  color: defaultColor,
  fcm_token: null,
  notification: {},
  team: null
};

export default function(state: SettingState = defaultState, action: Action): SettingState {
  switch (action.type) {
    case 'LOAD_SETTINGS_FULFILLED': {
      if (action.payload.ok) {
        state = { ...state, ...action.payload.data };
      }

      return state;
    }

    case UPDATE_FCM_TOKEN + FULFILLED: {
      if (action.payload.ok) {
        state = { ...state, fcm_token: action.payload.data.fcm_token };
      }

      return state;
    }

    case LOGOUT + FULFILLED: {
      state = { ...state, color: defaultColor, team: null };
      return state;
    }

    case SET_NOTIFICATION: {
      state = { ...state };
      state.notification[action.payload.key] = !!action.payload.value;
      state.changed = true;

      return state;
    }

    case SET_GROUP_NOTIFICATION: {
      state = { ...state };
      if (!state.notification.leagues) {
        state.notification.leagues = {};
      }
      state.changed = true;
      state.notification.leagues[action.payload.key] = action.payload.value;

      return state;
    }

    case PUT_NOTIFICATION + FULFILLED: {
      if (action.payload.ok) {
        state = { ...state };
        state.changed = false;
      }

      return state;
    }

    case SET_USER_TEAM: {
      state = { ...state };
      if (!!action.payload.color) {
        state.color = action.payload.color;
      }
      state.team = {
        id: action.payload.id,
        image: action.payload.image,
        name: action.payload.name
      };

      return state;
    }
  }

  return state;
}
