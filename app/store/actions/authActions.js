import { API_KEY, TOKEN, LOAD_ACCESS_KEY, LOAD_TOKEN, LOGOUT, SET_USER_TEAM } from './types'
import api from '../../api'
import store from '../index'
import { AsyncStorage } from 'react-native'


export const requestAPIKey = (user) => {
    const accesskey = store.getState().auth.api_key

    if (accesskey != null) {
        return renewToken(accesskey)
    } else {
        return {
            payload: api.post('/user/auth', user),
            type: API_KEY
        }
    }
}

export const renewToken = (apiKey) => {

    return {
        payload: api.post('/user/auth/refresh', { access_key: apiKey }),
        type: TOKEN
    }
}

export const logout = () => {
    //TODO async payload
    api.delete('/user/auth')

    return {
        payload: {},
        type: LOGOUT
    }
}

export const setUserTeam = (team) => {
    return {
        payload: team,
        type: SET_USER_TEAM
    }
}

export const loadAccessKey = () => {
    return {
        payload: new Promise(resolve => {
            try {
                AsyncStorage.getItem(API_KEY).then(serializedKey => {
                    if (serializedKey) {
                        const accessKey = JSON.parse(serializedKey)

                        resolve({
                            data: accessKey,
                            ok: true
                        })
                    } else {
                        resolve({
                            ok: false
                        })
                    }
                })
            } catch (ex) {
                resolve({
                    ok: false
                })
            }
        }),
        type: LOAD_ACCESS_KEY
    }
}

export const loadToken = () => {
    return {

        payload: new Promise(resolve => {
            try {
                AsyncStorage.getItem(TOKEN).then( serializedToken => {
                    if (serializedToken) {
                        const token = JSON.parse(serializedToken)

                        resolve({
                            data: token,
                            ok: true
                        })
                    } else {
                        resolve({
                            ok: false
                        })
                    }
                })
            } catch (ex) {
                resolve({
                    ok: false
                })
            }
        }),
        type: LOAD_TOKEN
    }
}
