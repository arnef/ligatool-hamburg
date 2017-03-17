import { SET_SETTINGS, LOAD_SETTINGS, SET_NOTIFICATION, SET_GROUP_NOTIFICATION,
         PUT_NOTIFICATION, SET_DEVICE_TOKEN
} from './types';
import { AsyncStorage } from 'react-native';
import api from '../../api';
const STORAGE_KEY = 'SETTINGS_V09';
import store from '../index';

export const setSettings = (settings) => {
    return {
        type: SET_SETTINGS,
        payload: settings
    };
};

export const setNotification = (key, value) => {
    return {
        type: SET_NOTIFICATION,
        payload: { key, value }
    };
};

export const setGroupNotification = (key, value) => {
    return {
        type: SET_GROUP_NOTIFICATION,
        payload: { key, value }
    };
};

export const saveNotifications = () => {
    const settings = store.getState().settings;
    return {
        type: PUT_NOTIFICATION,
        payload: api.post('/notification', {
            notification: settings.notification,
            fcm_token: settings.fcm_token
        })
    };
};


export const setDeviceToken = (token) => {
    return {
        type: SET_DEVICE_TOKEN,
        payload: token
    };
};

export const loadSettings = () => {
    return {
        type: LOAD_SETTINGS,
        payload: new Promise((resolve, reject) => {
            try {
                AsyncStorage.getItem(STORAGE_KEY).then(serializedSettings => {
                    if (serializedSettings) {
                        const settings = JSON.parse(serializedSettings);
                        resolve({
                            ok: true,
                            data: settings
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
    }
};