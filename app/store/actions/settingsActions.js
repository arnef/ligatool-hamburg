// @flow
import {
  SET_SETTINGS,
  LOAD_SETTINGS,
  SET_NOTIFICATION,
  SET_GROUP_NOTIFICATION,
  PUT_NOTIFICATION,
  SET_DEVICE_TOKEN
} from './types';
import { AsyncStorage } from 'react-native';
import api, { NOTIFICATION } from '../../api';
import store from '../index';

const STORAGE_KEY = 'SETTINGS_V09';

export function setSettings(settings: any): Action {
  return {
    payload: settings,
    type: SET_SETTINGS
  };
}

export function setNotification(key: string, value: boolean): Action {
  return {
    payload: { key, value },
    type: SET_NOTIFICATION
  };
}

export function setGroupNotification(key: string, value: boolean): Action {
  return {
    payload: { key, value },
    type: SET_GROUP_NOTIFICATION
  };
}

export function saveNotifications(): Action {
  const settings = store.getState().settings;

  return {
    payload: api.post(NOTIFICATION, {
      fcm_token: settings.fcm_token,
      notification: settings.notification
    }),
    type: PUT_NOTIFICATION
  };
}

// unused?
// export const setDeviceToken = (token) => {
//     return {
//         payload: token,
//         type: SET_DEVICE_TOKEN
//     }
// }

export function loadSettings(): Action {
  return {
    payload: new Promise(resolve => {
      try {
        AsyncStorage.getItem(STORAGE_KEY).then(serializedSettings => {
          if (serializedSettings) {
            const settings = JSON.parse(serializedSettings);

            resolve({
              data: settings,
              ok: true
            });
          } else {
            resolve({
              ok: false
            });
          }
        });
      } catch (ex) {
        resolve({
          ok: false
        });
      }
    }),
    type: LOAD_SETTINGS
  };
}
