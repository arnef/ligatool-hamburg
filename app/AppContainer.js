import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MenuContext } from 'react-native-menu';
import { ActionCreators } from './actions';
import LoadingScreen from './components/LoadingScreen';
import FCM, { FCMEvent } from 'react-native-fcm';
import App from './App';

class AppContainer extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.loadAccessKey();
		this.props.loadToken();
		this.props.loadSettings();
	}

	componentWillReceiveProps(nextProps) {
		const renewToken = !!(!this.props.initApp.renewToken && nextProps.initApp.renewToken && nextProps.auth.api_key);
		if (renewToken) {
			nextProps.renewToken(nextProps.auth.api_key);
		}
		if (nextProps.initApp.tasks === nextProps.initApp.tasksDone.length) {
			// enable notification when token is loaded 
			if (!this.refreshTokenListener && !this.notificationListener) {
				this.mountNotification();
			}
		}
	}

	/* maybe uncomment for newer fcm version */
	componentWillUnmount() {
		if (this.refreshTokenListener) {
			this.refreshTokenListener.remove();
		}
		if (this.notificationListener) {
			this.notificationListener.remove();
		}
	}

	mountNotification() {
		FCM.requestPermissions();
		FCM.getFCMToken().then( token => {
			if (!!token) {
				this.props.updateFCMToken(token);
			}
		});
		this.notificationListener = FCM.on(FCMEvent.Notification, (notif) => {
			console.tron.log(notif);
			this.props.receiveNotification(notif);
			
		});	
		this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
			//TODO check get token wasn't succesfully
		});
	}


	render() {
		const initApp = this.props.initApp;
		if (initApp.tasksDone.length === initApp.tasks) {
			return (<MenuContext style={{flex: 1}}><App {...this.props} /></MenuContext>);
		} else {
			return (<LoadingScreen spinner />);
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
	loadAccessKey: React.PropTypes.func,
	loadToken: React.PropTypes.func,
	loadSettings: React.PropTypes.func,
	renewToken: React.PropTypes.func,
	updateFCMToken: React.PropTypes.func,
	receiveNotification: React.PropTypes.func,
	initApp: React.PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
