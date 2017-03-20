import React, { Component } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from './store/actions';
import LoadingScreen from './components/LoadingScreen';
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm';
import App from './App';
import * as routes from './views/routes';

class AppContainer extends Component {
	
	componentDidMount() {
		this.mountNotification();
		this.props.connect();
	}

	componentWillUnmount() {
		if (this.refreshTokenListener) {
			this.refreshTokenListener.remove();
		}
		if (this.notificationListener) {
			this.notificationListener.remove();
		}
	}

	syncNotifications(token) {
		if (token) {
			//TODO sync notification with fcm in one method
			this.props.updateFCMToken(token);
			if (this.props.settings.notification.leagues) {
				console.tron.log('FCM TOKEN RECEIVED AND NOTIFICATION INITIALIZED');
				this.props.saveNotifications();
			}
		}
		
	}

	mountNotification() {
		FCM.requestPermissions();
		FCM.getFCMToken().then( token => {
			this.syncNotifications(token);
		});
		this.notificationListener = FCM.on(FCMEvent.Notification, (notif) => {
		
			if (Platform.OS === 'ios') {
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

			console.tron.log(notif);

			if (!notif.local_notification) {
				this.props.receiveNotification(notif);
			}
			if (Platform.OS === 'android' && notif.fcm && notif.fcm.tag) {
				const localNotif = { ...notif.fcm };
				localNotif.vibrate = 0;
				localNotif.data = { type: notif.type, id: notif.id }
				localNotif.show_in_foreground = true;

				FCM.presentLocalNotification(localNotif);
			}			
		});	
		this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
			this.syncNotifications(token);
		});
	}

	changeRoute(route) {
		if (this.app && this.app.navigator) {
			this.app.navigator.push(route);
		}
	}

	render() {
		// const initApp = this.props.initApp;
		if (this.props.appConnected) {
			return <App {...this.props} getRef={app => this.app  = app} />;
		} else {
			return <LoadingScreen />;
		}
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
	return state;
}

AppContainer.propTypes = {
	auth: React.PropTypes.object,
	loadAccessKey: React.PropTypes.func,
	loadToken: React.PropTypes.func,
	loadSettings: React.PropTypes.func,
	renewToken: React.PropTypes.func,
	updateFCMToken: React.PropTypes.func,
	receiveNotification: React.PropTypes.func,
	initApp: React.PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
