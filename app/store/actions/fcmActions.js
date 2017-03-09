import { UPDATE_FCM_TOKEN, SCORE, SUGGEST_SCORE, NOTIFICATION } from './types';
import api from '../../api';
import { getMatch } from './matchActions';
import { isAdminForMatch } from '../../Helper';
import store from '../index';

export const updateFCMToken = (token) => {
    return {
        type: UPDATE_FCM_TOKEN,
        payload: api.post('/notification', { fcm_token: token})
    };
};

export const receiveNotification = (notification) => {
    if (notification.type === SCORE || notification.type === SUGGEST_SCORE) {
        const ignore = store.getState().match.ignoreNextNotify;
        const match = store.getState().match.data;
        if (!ignore && match && match.id === parseInt(notification.id, 10)) {
            store.dispatch(getMatch(match.id, isAdminForMatch(match)));
        }
    }

    return {
        type: notification.type + NOTIFICATION,
        payload: notification
    };
};