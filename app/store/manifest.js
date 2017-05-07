// @flow
import api, { LEAGUES, USER_AUTH_REFRESH } from '../api';
import { LOAD_SETTINGS_FULFILLED, FULFILLED, QUERY_RANKINGS, TOKEN } from './actions/types';


export default {
  '1': state => ({ ...state })
};

export const APP_KEY = 'app';

export function migrateFromStorage(store, AsyncStorage) {
  return new Promise(resolve => {
    AsyncStorage.getAllKeys((err, keys) => {
      if (!err && keys.length === 3) {
        console.log(keys);
        Promise.all([
          AsyncStorage.getItem('API_KEY'),
          AsyncStorage.getItem('TOKEN'),
          AsyncStorage.getItem('SETTINGS_V09')
        ])
          .then(values => {
            try {
              values[0] = JSON.parse(values[0]);
              values[1] = JSON.parse(values[1]);
              values[2] = JSON.parse(values[2]);
              console.log(values);
              store.dispatch({
                payload: { ok: true, data: values[2] },
                type: 'LOAD_SETTINGS_FULFILLED'
              });
              store.dispatch({
                payload: { ok: true, data: values[1] },
                type: 'TOKEN_FULFILLED'
              });
              store.dispatch({
                payload: { ok: true, data: { access_key: values[0] } },
                type: 'API_KEY_FULFILLED'
              });
            } catch (ex) {
              console.warn(ex);
            }
            resolve();
          })
          .catch(ex => {
            resolve();
          });
      } else {
        resolve();
      }
    });
  });
}

export function setDefaultSettings(store) {
  return new Promise(resolve => {
    const state = store.getState();
    if (Object.keys(state.settings.notification).length === 0) {
      api.get(LEAGUES).then(resp => {
        if (resp.ok) {
          store.dispatch({
            type: QUERY_RANKINGS + FULFILLED,
            payload: resp
          });
          const notification = { on: true, live: true, ended: true, leagues: {} };
          for (let league of resp.data) {
            console.tron.log(league);
            notification.leagues[league.id] = true;
          }
          store.dispatch({
            type: LOAD_SETTINGS_FULFILLED,
            payload: { ok: true, data:{ notification } }
          });
          console.tron.log('set default settings');
          resolve({ ok: true });
        } else {
          resolve({ ok: false, message: 'Fehler beim Laden der Gruppen' });
        }
      })
    } else {
      resolve({ ok: true });
    }
  })
}

export function checkToken(store) {
  return new Promise(resolve => {
    const auth = store.getState().auth;
    if (auth.api_key && auth.team.expires < new Date().getTime()) {
      api.post(USER_AUTH_REFRESH, { access_key: auth.api_key }).then(resp => {
        store.dispatch({
          type: TOKEN + FULFILLED,
          payload: resp
        });
        api.get(LEAGUES).then(resp => {
          store.dispatch({
            type: QUERY_RANKINGS + FULFILLED,
            payload: resp
          });
          resolve();
        })
      })
    } else {
      resolve();
    }
  });
}
