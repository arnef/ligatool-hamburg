// @flow
import * as api from '../api';
import {
  LOAD_SETTINGS_FULFILLED,
  QUERY_RANKINGS,
  TOKEN,
} from './actions/types';

export default {
  '1': (state: any) => ({ ...state }),
};

export const APP_KEY = 'app';

export function migrateFromStorage(store: any, AsyncStorage: any) {
  return new Promise(resolve => {
    AsyncStorage.getAllKeys((err, keys) => {
      if (!err && keys.length === 3) {
        Promise.all([
          AsyncStorage.getItem('API_KEY'),
          AsyncStorage.getItem('TOKEN'),
          AsyncStorage.getItem('SETTINGS_V09'),
        ])
          .then(values => {
            try {
              values[0] = JSON.parse(values[0]);
              values[1] = JSON.parse(values[1]);
              values[2] = JSON.parse(values[2]);
              store.dispatch({
                payload: { ok: true, data: values[2] },
                type: 'LOAD_SETTINGS_FULFILLED',
              });
              store.dispatch({
                payload: { ok: true, data: values[1] },
                type: 'TOKEN_FULFILLED',
              });
              store.dispatch({
                payload: { ok: true, data: { access_key: values[0] } },
                type: 'API_KEY_FULFILLED',
              });
            } catch (ex) {
              console.warn(ex);
            }
            resolve();
          })
          .catch(() => {
            resolve();
          });
      } else {
        resolve();
      }
    });
  });
}

export function setDefaultSettings(store: any) {
  return new Promise(resolve => {
    const state = store.getState();
    if (Object.keys(state.settings.notification).length === 0) {
      api.getLeagues().then(resp => {
        if (resp.ok) {
          store.dispatch({
            type: QUERY_RANKINGS,
            payload: resp,
          });
          const notification = {
            on: true,
            live: true,
            ended: true,
            leagues: {},
          };
          for (let league of resp.data) {
            notification.leagues[league.id] = true;
          }
          store.dispatch({
            type: LOAD_SETTINGS_FULFILLED,
            payload: { ok: true, data: { notification } },
          });
          resolve({ ok: true });
        } else {
          resolve({ ok: false, message: 'Fehler beim Laden der Gruppen' });
        }
      });
    } else {
      resolve({ ok: true });
    }
  });
}

export function checkToken(store: any) {
  return new Promise(resolve => {
    const auth = store.getState().auth;
    if (auth.api_key && auth.team) {
      if (auth.team.expires < new Date().getTime()) {
        api.refreshAuthentication(auth.api_key).then(resp => {
          if (resp.ok) {
            store.dispatch({
              type: TOKEN,
              payload: resp.data,
            });
          }
        });
        resolve();
      } else {
        api.setHeader('Secret', auth.team.token);
        resolve();
      }
    } else {
      resolve();
    }
  });
}
