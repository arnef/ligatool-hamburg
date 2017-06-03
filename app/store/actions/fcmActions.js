// @flow
import { UPDATE_FCM_TOKEN, FULFILLED, NOTIFICATION } from './types';

export function updateFCMToken(token: string): Action {
  return {
    payload: { data: { fcm_token: token }, ok: true },
    type: UPDATE_FCM_TOKEN + FULFILLED,
  };
}

export function receiveNotification(notification: any): Action {
  return {
    payload: notification,
    type: notification.type + NOTIFICATION,
  };
}
