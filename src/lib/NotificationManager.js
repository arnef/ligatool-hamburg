import { Platform } from 'react-native';
import firebase from 'react-native-firebase';
import { NavigationActions } from 'react-navigation';
import { store } from '../config/store';
import * as SettingsActions from '../redux/modules/settings';
import * as MatchesActions from '../redux/modules/matches';
import { Routes } from 'src/scenes/routes';
import { currentRoute } from './NavUtils';
import { getFixture } from '../redux/modules/fixtures';

/**
 *
 */
function notificationListener() {
  return () => {};
  // return FCM.on(FCMEvent.Notification, receiveNotification);
}

/**
 *
 */
function refreshTokenListener() {
  return firebase.messaging().onTokenRefresh(refreshToken);
  // return FCM.on(FCMEvent.RefreshToken, refreshToken);
}

function getToken() {
  firebase
    .messaging()
    .getToken()
    .then(refreshToken);
}

/**
 * handle notification
 */
function receiveNotification(notif) {
  // if (notif) {
  //   const route = currentRoute(store.getState().nav.navigation);
  //   const id = notif.fixture_id;
  //   const matchOpen =
  //     (route.routeName === Routes.MATCH ||
  //       route.routeName === Routes.MATCH_DATE) &&
  //     route.params &&
  //     route.params.id === id;
  //   if (Platform.OS === 'ios') {
  //     switch (notif._notificationType) {
  //       case NotificationType.Remote:
  //         notif.finish(RemoteNotificationResult.NewData);
  //         break;
  //       case NotificationType.NotificationResponse:
  //         notif.finish();
  //         break;
  //       case NotificationType.WillPresent:
  //         notif.finish(
  //           matchOpen
  //             ? WillPresentNotificationResult.None
  //             : WillPresentNotificationResult.All,
  //         );
  //         break;
  //     }
  //   } else {
  //     // show banner on android if app is in foreground
  //     if (!matchOpen && !notif.local_notification && !notif.opened_from_tray) {
  //       FCM.presentLocalNotification({
  //         ...notif.fcm,
  //         id: notif.id,
  //         fixture_id: notif.fixture_id,
  //         show_in_foreground: true,
  //         priority: 'high',
  //       });
  //     }
  //   }
  //   if (notif.type && !notif.local_notification) {
  //     store.dispatch({
  //       type: notif.type,
  //       payload: notif,
  //     });
  //     if (matchOpen) {
  //       store.dispatch(MatchesActions.getMatch(id));
  //     }
  //   }
  //   if (notif.opened_from_tray && !matchOpen && id) {
  //     if (Platform.OS === 'ios') {
  //       store.dispatch(
  //         NavigationActions.navigate({
  //           routeName: Routes.OVERVIEW,
  //         }),
  //       );
  //     }
  //     const match = getFixture(store.getState(), id);
  //     store.dispatch(
  //       NavigationActions.navigate({
  //         routeName: Routes.MATCH,
  //         params: {
  //           id,
  //           title: match ? match.competitionName : null,
  //         },
  //       }),
  //     );
  //   }
  // }
}

/**
 * update token and sync with server
 */
function refreshToken(token) {
  console.log(token);
  if (token) {
    store.dispatch(SettingsActions.setFCMToken(token));
  }
}

/**
 * handle notification on app start
 */
function getInitialNotification(notif) {
  // if (notif) {
  //   if (Platform.OS === 'ios') {
  //     // set to open match in app
  //     notif.opened_from_tray = true;
  //   }
  //   if (notif.type) {
  //     receiveNotification(notif);
  //   }
  // }
}

/**
 * set notification and token listener and
 * on iOS request permission to receive notifications.
 */
function requestPermissions() {
  firebase.messaging().requestPermission();
}

/**
 * remove notification with id from tray/center
 * BUG not working at the moment
 */
export function removeNotification(id) {
  // FCM.removeDeliveredNotification(`${id}`);
}

/**
 * remove all notifications from tray/center
 */
export function removeAllNotifications() {
  // FCM.removeAllDeliveredNotifications();
}

export default {
  getToken,
  requestPermissions,
  notificationListener,
  refreshTokenListener,
  removeNotification,
  removeAllNotifications,
};
