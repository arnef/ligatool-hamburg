// @flow
import { UPDATE_FCM_TOKEN, NOTIFICATION } from './types';
import api from '../../api';

export function updateFCMToken(token: string): Action {
  api.defaults.headers.common['x-fcm'] = token;
  return {
    payload: { data: { fcm_token: token }, ok: true },
    type: UPDATE_FCM_TOKEN,
  };
}

export function receiveNotification(notification: any): Action {
  return {
    payload: notification,
    type: notification.type + NOTIFICATION,
  };
}
