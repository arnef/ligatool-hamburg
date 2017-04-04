import Storage from '../../Storage'
import api from '../../api'
import store from '../index'
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
} from './types'


/**
 * synchronize local data with server
 */
export const initApp = () => {

    return {
        payload: new Promise(resolve => {
            const restoreSettings = new Promise(resolve => {
                Storage.getItem(SETTINGS_KEY).then(settings => {
                    // console.tron.log(settings)
                    if (!settings.ok) { // no settings saved
                        api.get('/leagues').then(resp => {
                            store.dispatch({
                                payload: resp,
                                type: QUERY_RANKINGS + FULFILLED
                            })
                            if (resp.ok) {
                                const notification = {
                                    ended: true,
                                    leagues: {},
                                    live: true,
                                    on: true
                                }

                                for (let league of resp.data) {
                                    notification.leagues[`${league.id}`] = true
                                }
                                Storage.setItem(SETTINGS_KEY, {
                                    notification
                                })
                                resolve({
                                    data: { notification },
                                    ok: true
                                })
                            } else {
                                resolve({})
                            }
                        })
                    } else {
                        resolve(settings)
                    }
                })
            })

            const restoreAuth = new Promise(resolve => {
                Promise.all([Storage.getItem(API_KEY), Storage.getItem(TOKEN)])
                .then(values => {
                    const apiAccessKey = values[0]
                    const apiToken = values[1]

                    if (apiAccessKey.ok && apiToken.ok) {
                        store.dispatch({
                            payload: apiAccessKey,
                            type: LOAD_ACCESS_KEY + FULFILLED
                        })
                        const now = (new Date()).getMilliseconds()

                        // console.tron.log('token expired ' + (apiToken.expires < now))
                        if (apiToken.expires < now) {
                            api.post('/uer/auth/refresh', { access_key: apiAccessKey.data })
                            .then(resp => {
                                store.dispatch({
                                    payload: resp,
                                    type: TOKEN + FULFILLED
                                })
                                resolve()
                            })
                        } else {
                            store.dispatch({
                                payload: apiToken,
                                type: LOAD_TOKEN + FULFILLED
                            })
                            resolve()
                        }
                    } else { resolve() }
                })
            })

            const timeout = new Promise(resolve => {
                setTimeout(() => {
                    resolve()
                }, 2000)
            })

            Promise.all([restoreSettings, restoreAuth, timeout]).then(values => {
                const settings = store.getState().settings
                const savedSettings = values[0]

                if (settings.fcm_token && savedSettings.ok) {
                    // console.tron.log('FCM_TOKEN SET SEND UPDATE')

                    api.post('/notification', {
                        fcm_token: settings.fcm_token,
                        notification: savedSettings.data.notification
                    }).then(() => {
                        store.dispatch({
                            payload: savedSettings,
                            type: LOAD_SETTINGS + FULFILLED
                        })
                        resolve()
                    })

                } else {
                    // console.tron.log('NO FCM TOKEN, SKIP UPDATE')

                    store.dispatch({
                        payload: savedSettings,
                        type: LOAD_SETTINGS + FULFILLED
                    })
                    resolve()
                }
            })

        }),
        type: INIT_APP
    }
}

