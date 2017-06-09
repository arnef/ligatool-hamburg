// @flow
import {
  SET_NOTIFICATION,
  SET_GROUP_NOTIFICATION,
  PUT_NOTIFICATION,
  CLEAR_IMAGE_CACHE,
} from './types';
import api, { NOTIFICATION } from '../../api';
import { clearCache } from 'react-native-http-cache';

export function setNotification(key: string, value: boolean): Action {
  return {
    payload: { key, value },
    type: SET_NOTIFICATION,
  };
}

export function setGroupNotification(key: string, value: boolean): Action {
  return {
    payload: { key, value },
    type: SET_GROUP_NOTIFICATION,
  };
}

export function clearImageCache() {
  return {
    type: CLEAR_IMAGE_CACHE,
    payload: clearCache(),
  };
}

export function saveNotifications(
  fcm_token: string,
  notification: any,
): Function {
  return (dispatch, getState) => {
    if (!fcm_token || !notification) {
      const settings = getState().settings;
      fcm_token = settings.fcm_token;
      notification = settings.notification;
    }
    dispatch({
      type: PUT_NOTIFICATION,
      payload: api.post(NOTIFICATION, { fcm_token, notification }),
    });
  };
}
