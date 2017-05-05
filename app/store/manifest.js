// @flow

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
