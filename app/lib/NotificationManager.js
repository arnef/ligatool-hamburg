// @flow
import { Platform } from 'react-native';
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType,
} from 'react-native-fcm';
import { NavigationActions } from 'react-navigation';
import store from '../config/store';
import * as SettingsActions from '../redux/modules/settings';
import * as MatchesActions from '../redux/modules/matches';
import Routes from '../config/routes';
import { currentRoute } from './NavUtils';

export type Listener = {
  remove: Function,
};

type Notification = {
  collapse_key: string,
  opened_from_tray: boolean,
  from: string,
  notification: {
    title?: string,
    body: string,
    icon: string,
  },
  _notificationType: string,
  finish(type?: string): void,
};

/**
 *
 */
function notificationListener(): Listener {
  return FCM.on(FCMEvent.Notification, receiveNotification);
}

/**
 *
 */
function refreshTokenListener(): Listener {
  return FCM.on(FCMEvent.RefreshToken, refreshToken);
}

/**
 * handle notification
 */
function receiveNotification(notif: Notification) {
  if (notif) {
    const route = currentRoute(store.getState().nav.navigation);
    const id = notif.id;
    const matchOpen =
      (route.routeName === Routes.MATCH ||
        route.routeName === Routes.MATCH_DATE) &&
      route.params &&
      route.params.id === id;
    console.log(
      route,
      matchOpen,
      Routes.MATCH,
      route.routeName === Routes.MATCH,
    );
    if (Platform.OS === 'ios') {
      switch (notif._notificationType) {
        case NotificationType.Remote:
          notif.finish(RemoteNotificationResult.NewData);
          break;
        case NotificationType.NotificationResponse:
          notif.finish();
          break;
        case NotificationType.WillPresent:
          notif.finish(
            matchOpen
              ? WillPresentNotificationResult.None
              : WillPresentNotificationResult.All,
          );
          break;
      }
    } else {
      // show banner on android if app is in foreground
      if (!matchOpen && !notif.local_notification && !notif.opened_from_tray) {
        FCM.presentLocalNotification({
          ...notif.fcm,
          id: notif.id,
          show_in_foreground: true,
          priority: 'high',
        });
      }
    }

    if (notif.type && !notif.local_notification) {
      if (matchOpen) {
        store.dispatch(MatchesActions.getMatch(id));
      } else {
        store.dispatch(MatchesActions.notification(notif));
      }
    }

    if (notif.opened_from_tray && !matchOpen && id) {
      if (Platform.OS === 'ios') {
        store.dispatch(
          NavigationActions.navigate({
            routeName: Routes.OVERVIEW,
          }),
        );
      }

      // const match = store.getState().matches[id];

      store.dispatch(
        NavigationActions.navigate({
          routeName: Routes.MATCH,
          params: {
            id,
            // isAdmin: match && isAdminForMatch(match, store.getState().auth),
          },
        }),
      );
    }
  }
}

/**
 * update token and sync with server
 */
function refreshToken(token: string) {
  if (token) {
    store.dispatch(SettingsActions.setFCMToken(token));
  }
}

/**
 * handle notification on app start
 */
function getInitialNotification(notif: Notification) {
  if (notif) {
    if (Platform.OS === 'ios') {
      // set to open match in app
      notif.opened_from_tray = true;
    }
    if (notif.type) {
      receiveNotification(notif);
    }
  }
}

/**
 * set notification and token listener and
 * on iOS request permission to receive notifications.
 */
function requestPermissions() {
  FCM.requestPermissions();
  FCM.getInitialNotification().then(getInitialNotification);
  FCM.getFCMToken().then(refreshToken);
}

/**
 * remove notification with id from tray/center
 * BUG not working at the moment
 */
export function removeNotification(id: number) {
  FCM.removeDeliveredNotification(`${id}`);
}

/**
 * remove all notifications from tray/center
 */
export function removeAllNotifications() {
  FCM.removeAllDeliveredNotifications();
}

export default {
  requestPermissions,
  notificationListener,
  refreshTokenListener,
  removeNotification,
  removeAllNotifications,
};
