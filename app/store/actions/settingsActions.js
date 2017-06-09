// @flow
import {
  SET_NOTIFICATION,
  SET_GROUP_NOTIFICATION,
  PUT_NOTIFICATION,
  LOADING_FULLSCREEN,
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

export function clearImageCache(): Function {
  return dispatch => {
    dispatch({ type: LOADING_FULLSCREEN, payload: { loading: true } });
    clearCache().then(() => {
      dispatch({ type: LOADING_FULLSCREEN, payload: { loading: false } });
    });
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
    api
      .post(NOTIFICATION, { fcm_token, notification })
      .then(() => {
        dispatch({
          type: PUT_NOTIFICATION,
        });
      })
      .catch(ex => {
        console.log(ex);
      });
  };
}
