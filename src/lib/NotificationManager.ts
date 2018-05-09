/**
 * Copyright (C) 2018 Arne Feil
 *
 * This file is part of DTFB App.
 *
 * DTFB App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DTFB App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DTFB App.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import firebase from 'react-native-firebase';

import { store } from '@app/config/store';
import * as SettingsActions from '@app/redux/modules/settings';

/**
 *
 */
function notificationListener() {
  return () => {
    console.warn('no notif listener');
  };
}

/**
 *
 */
function refreshTokenListener() {
  return firebase.messaging().onTokenRefresh(refreshToken);
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
// function receiveNotification(notif: any) {
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
// }

/**
 * update token and sync with server
 */
function refreshToken(token: string) {
  if (token) {
    store.dispatch(SettingsActions.setFCMToken(token));
  }
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
export function removeNotification(id: string) {
  console.warn(`remove notification ${id}`);
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
  notificationListener,
  refreshTokenListener,
  removeAllNotifications,
  removeNotification,
  requestPermissions,
};
