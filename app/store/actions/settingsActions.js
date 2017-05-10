// @flow
import {
  SET_NOTIFICATION,
  SET_GROUP_NOTIFICATION,
  PUT_NOTIFICATION
} from './types';
import api, { NOTIFICATION } from '../../api';
import store from '../index';

export function setNotification(key: string, value: boolean): Action {
  return {
    payload: { key, value },
    type: SET_NOTIFICATION
  };
}

export function setGroupNotification(key: string, value: boolean): Action {
  return {
    payload: { key, value },
    type: SET_GROUP_NOTIFICATION
  };
}

export function saveNotifications(fcm_token: string, notification: any): Action {
  //
  if (!fcm_token || !notification) {
    const settings = store.getState().settings;
    fcm_token = settings.fcm_token;
    notification = settings.notification
  }
  return {
    payload: api.post(NOTIFICATION, {
      fcm_token,
      notification,
    }),
    type: PUT_NOTIFICATION
  };
}
