import Storage from '../../Storage';
import api from '../../api';
import store from '../index';
import {
    INIT_APP,
    API_KEY,
    TOKEN,
    SETTINGS_KEY,
    LOAD_SETTINGS,
    LOAD_ACCESS_KEY,
    LOAD_TOKEN,
    FULFILLED,
    QUERY_RANKINGS
} from './types';


/**
 * synchronize local data with server
 */
export const connect = () => {

    return {
        type: INIT_APP,
        payload: new Promise(resolve => {

            const restoreSettings = new Promise(resolve => {
                Storage.getItem(SETTINGS_KEY).then(settings => {
                    if (!settings.ok) { // no settings saved 
                        api.get('/leagues').then(resp => {
                            store.dispatch({
                                type: QUERY_RANKINGS + FULFILLED,
                                payload: resp
                            });
                            if (resp.ok) {
                                const notification = {
                                    on: true,
                                    live: true,
                                    ended: true,
                                    leagues: {}
                                };
                                for (let league of resp.data) {
                                    notification.leagues[`${league.id}`] = true;
                                }
                                Storage.setItem(SETTINGS_KEY, {
                                    notification
                                });
                                resolve({ ok: true, data: { notification }});
                            } else {
                                resolve({});
                            }
                        });
                    } else {
                        resolve(settings);
                    }
                });
            });

            const restoreAuth = new Promise(resolve => {
                Promise.all([Storage.getItem(API_KEY), Storage.getItem(TOKEN)])
                .then(values => {
                    const apiAccessKey = values[0];
                    const apiToken = values[1];
                    if (apiAccessKey.ok && apiToken.ok) {
                        store.dispatch({
                            type: LOAD_ACCESS_KEY + FULFILLED,
                            payload: apiAccessKey
                        });
                        if (apiToken.expires < (new Date()).getMilliseconds()) {
                            api.post('/uer/auth/refresh', { access_key: apiAccessKey.data })
                            .then(resp => {
                                store.dispatch({
                                    type: TOKEN + FULFILLED,
                                    payload: resp
                                });
                                resolve();
                            });
                        } else {
                            store.dispatch({
                                type: LOAD_TOKEN + FULFILLED,
                                payload: apiToken
                            });
                            resolve();
                        }
                    } else { resolve() }
                });
            })

            Promise.all([restoreSettings, restoreAuth]).then(values => {
                const settings = store.getState().settings;
                const savedSettings = values[0];
                if (settings.fcm_token && savedSettings.ok) {
                    console.tron.log('FCM_TOKEN SET SEND UPDATE');
                    api.post('/notification', {
                        notification: savedSettings.data,
                        fcm_token: settings.fcm_token
                    }).then(resp => {
                        store.dispatch({
                            type: LOAD_SETTINGS + FULFILLED,
                            payload: savedSettings
                        });
                        resolve();
                    });
                    
                } else {
                    console.tron.log('NO FCM TOKEN, SKIP UPDATE');
                    store.dispatch({
                        type: LOAD_SETTINGS + FULFILLED,
                        payload: savedSettings
                    });
                    resolve();
                }
            });

        })
    };
};

