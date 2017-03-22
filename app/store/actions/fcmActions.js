import { UPDATE_FCM_TOKEN, SCORE, FULFILLED, SUGGEST_SCORE, NOTIFICATION } from './types';
import { getMatch } from './matchActions';
import { isAdminForMatch } from '../../Helper';
import store from '../index';

export const updateFCMToken = (token) => {
    return {
        type: UPDATE_FCM_TOKEN + FULFILLED,
        payload:{ ok: true, data: { fcm_token: token} }
    };
};

export const receiveNotification = (notification) => {
    if (notification.type === SCORE || notification.type === SUGGEST_SCORE) {
        const ignore = store.getState().match.ignoreNextNotify;
        const match = store.getState().match.data;
        if (!ignore && match && match.id === parseInt(notification.id, 10)) {
            console.tron.log('FCM ACTION FIRED getMatch')
            store.dispatch(getMatch(match.id, isAdminForMatch(match)));
        }
    }

    return {
        type: notification.type + NOTIFICATION,
        payload: notification
    };
};