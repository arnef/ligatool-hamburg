// @flow
import React, { Component } from 'react';
import { View, Platform, BackAndroid } from 'react-native';
import { connect } from 'react-redux';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import actions from './store/actions';
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from 'react-native-fcm';
import Loading from './modals/LoadingModal';
import { ANDROID, IOS } from './consts';
import { currentRoute } from './Helper';
import { MATCH } from './views/routes';
import { Root } from './router';
import { backgroundColor } from './components/base/theme';

class AppContainer extends Component {
  componentWillMount() {
    this.mountNotification();
    BackAndroid.addEventListener('hardwareBackPress', () => {
      const oldnav = this.props.nav;
      this.props.dispatch({ type: NavigationActions.BACK });
      const dontClose = this.props.nav !== oldnav;
      if (dontClose) {
        this.props.dispatch({ type: 'UPDATE_DRAWER_ITEM'});
      }
      return dontClose;
    });
  }


  componentWillUnmount() {
    if (this.refreshTokenListener) {
      this.refreshTokenListener.remove();
    }
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    BackAndroid.removeEventListener('hardwareBackPress');
  }

  syncNotifications(token) {
    console.tron.log('received token: ' + token);
    if (token) {
      this.props.updateFCMToken(token);
      if (this.props.settings.notification.leagues) {
        console.tron.log('FCM TOKEN RECEIVED AND NOTIFICATION INITIALIZED');
        this.props.saveNotifications();
      }
    }
  }

  handleNotification(notif) {
    if (!notif) {
      return;
    }

    if (Platform.OS === IOS) {
      switch (notif._notificationType) {
        case NotificationType.Remote:
          notif.finish(RemoteNotificationResult.NewData);
          break;
        case NotificationType.NotificationResponse:
          notif.finish();
          break;
        case NotificationType.WillPresent:
          notif.finish(WillPresentNotificationResult.All);
          break;
      }
    }
    console.log(currentRoute());

    const route = currentRoute();
    const matchId = parseInt(notif.data ? notif.data.id : notif.id);

    // file local notification on android if match is not open
    if (
      Platform.OS === ANDROID &&
      notif.fcm &&
      notif.fcm.tag &&
      !(route.routeName === MATCH && route.params.id === matchId)
    ) {
      const localNotif = {
        ...notif.fcm,
        id: notif.id,
        data: { id: notif.id, type: notif.type },
        show_in_foreground: true
      };
      FCM.presentLocalNotification(localNotif);
    }

    // dispatch notification action
    if (
      notif.type &&
      !notif.local_notification &&
      !notif._completionHandlerId
    ) {
      this.props.receiveNotification(notif);
      //TODO update open match
    }

    // open match after click on notification
    if (
      !isNaN(matchId) &&
      notif.opened_from_tray &&
      !(route.routeName === MATCH && route.params.id === matchId)
    ) {
      this.props.pushRoute({
        routeName: MATCH,
        params: { id: matchId }
      });
    }
  }

  mountNotification() {
    FCM.requestPermissions();
    FCM.getInitialNotification().then(notif => {
      console.tron.log('get initial notification');
      this.handleNotification(notif);
    });
    FCM.getFCMToken().then(token => {
      this.syncNotifications(token);
    });
    this.notificationListener = FCM.on(FCMEvent.Notification, notif => {
      console.tron.log('notification listener');
      this.handleNotification(notif);
    });
    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
      this.syncNotifications(token);
    });
  }

  render() {
    const { dispatch, nav } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor }}>
        <Loading />
        <Root
          navigation={addNavigationHelpers({
            dispatch,
            state: nav
          })}
        />
      </View>
    );
  }
}

export default connect(
  state => ({
    auth: state.auth,
    nav: state.nav,
    settings: state.settings
  }),
  dispatch => ({
    dispatch: action => dispatch(action),
    renewToken: token => dispatch(actions.renewToken(token)),
    pushRoute: route => dispatch(NavigationActions.navigate(route)),
    receiveNotification: notif => dispatch(actions.receiveNotification(notif)),
    saveNotifications: () => dispatch(actions.saveNotifications()),
    setTab: idx => dispatch(actions.setTab(idx)),
    updateFCMToken: token => dispatch(actions.updateFCMToken(token))
  })
)(AppContainer);
