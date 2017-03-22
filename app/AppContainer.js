import React, { Component, PropTypes } from 'react'
import { Platform } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionCreators } from './store/actions'
import LoadingScreen from './components/LoadingScreen'
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm'
import App from './App'

class AppContainer extends Component {
    
    componentDidMount() {
        this.mountNotification()
        this.props.connect()
    }

    componentWillUnmount() {
        if (this.refreshTokenListener) {
            this.refreshTokenListener.remove()
        }
        if (this.notificationListener) {
            this.notificationListener.remove()
        }
    }

    syncNotifications(token) {
        if (token) {
            this.props.updateFCMToken(token)
            if (this.props.settings.notification.leagues) {
                console.tron.log('FCM TOKEN RECEIVED AND NOTIFICATION INITIALIZED')
                this.props.saveNotifications()
            }
        }   
    }

    mountNotification() {
        FCM.requestPermissions()
        FCM.getFCMToken().then( token => {
            this.syncNotifications(token)
        })
        this.notificationListener = FCM.on(FCMEvent.Notification, (notif) => {
            if (Platform.OS === 'ios') {
                switch (notif._notificationType) {
                    case NotificationType.Remote:
                        notif.finish(RemoteNotificationResult.NewData)
                        break
                    case NotificationType.NotificationResponse:
                        notif.finish()
                        break
                    case NotificationType.WillPresent:
                        notif.finish(WillPresentNotificationResult.All)
                        break
                }
            }
            if (Platform.OS === 'android' && notif.fcm && notif.fcm.tag) {
                const localNotif = { ...notif.fcm }
                const matchId = parseInt(notif.id)

                localNotif.vibrate = 0
                localNotif.data = { id: notif.id, type: notif.type }
                localNotif.show_in_foreground = true
                if (!(this.props.match.ignoreNextNotify && parseInt(matchId) === this.props.match.data.id)) {
                    FCM.presentLocalNotification(localNotif)
                }   
            }
            if (!notif.local_notification) {
                this.props.receiveNotification(notif)
            }
            console.tron.log(notif)
            if (notif.opened_from_tray === 1) {
                
            }
        })
        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
            this.syncNotifications(token)
        })
    }

    changeRoute(route) {
        if (this.app && this.app.navigator) {
            this.app.navigator.push(route)
        }
    }

    render() {
        if (this.props.appConnected) {
            return <App {...this.props} getRef={app => this.app  = app} />
        } else {
            return <LoadingScreen />
        }
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch)
}

function mapStateToProps(state) {
    return state
}

AppContainer.propTypes = {
    appConnected: PropTypes.bool,
    auth: PropTypes.object,
    connect: PropTypes.func,
    initApp: PropTypes.object,
    loadAccessKey: PropTypes.func,
    loadSettings: PropTypes.func,
    loadToken: PropTypes.func,
    match: PropTypes.object,
    receiveNotification: PropTypes.func,
    renewToken: PropTypes.func,
    saveNotifications: PropTypes.func,
    settings: PropTypes.object,
    updateFCMToken: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)
