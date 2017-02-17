import { API_KEY, TOKEN, LOAD_ACCESS_KEY, LOAD_TOKEN, LOGOUT, SET_USER_TEAM } from './types';
import api from '../api';
import store from '../store';
import { AsyncStorage } from 'react-native';


export const requestAPIKey = (user) => {
    const accesskey = store.getState().auth.api_key;
    
    if (accesskey != null) {
        return renewToken(accesskey);
    } else {
        return {
            type: API_KEY,
            payload: api.post('/user/auth', user)
        };
    }
};

export const renewToken = (apiKey) => {
    console.tron.log(apiKey);
    return {
        type: TOKEN,
        payload: api.post('/user/auth/refresh', { access_key: apiKey })
    };
};

export const logout = () => {
    return {
        type: LOGOUT,
        payload: {}
    };
};

export const setUserTeam = (team) => {
    return {
        type: SET_USER_TEAM,
        payload: team
    };
}

export const loadAccessKey = () => {
    return {
        type: LOAD_ACCESS_KEY,
        payload: new Promise((resolve, reject) => {
            try {
                AsyncStorage.getItem(API_KEY).then(serializedKey => {
                    if (serializedKey) {
                        const accessKey = JSON.parse(serializedKey);
                        resolve({
                            ok: true,
                            data: accessKey
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
        })
    };
};

export const loadToken = () => {
    return {
        type: LOAD_TOKEN,
        payload: new Promise( (resolve, reject) => {
            try {
                AsyncStorage.getItem(TOKEN).then( serializedToken => {
                    if (serializedToken) {
                        const token = JSON.parse(serializedToken);
                        resolve({
                            ok: true,
                            data: token
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
        })
    };
};
