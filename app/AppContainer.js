import React, { Component, PropTypes } from 'react'
import { Platform } from 'react-native'
import { connect } from 'react-redux'
import actions from './store/actions'
import LoadingScreen from './components/LoadingScreen'
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm'
import App from './App'
import { MATCH } from './views/routes'
import { TAB_OVERVIEW } from './views/tabs'

class AppContainer extends Component {

    componentDidMount() {
        this.mountNotification()
        this.props.initApp()
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
            if (notif.type && !notif.local_notification && !notif._completionHandlerId) {
                this.props.receiveNotification(notif)
            }
            console.tron.log(notif)

            if (notif.opened_from_tray) {

                const { setTab, pushRoute, route } = this.props
                const tabKey = route.tabs.routes[0].key
                const index = route[tabKey].index
                const lastRoute = route[tabKey].routes[index]

                if (Platform.OS === 'ios') {
                    setTab(TAB_OVERVIEW)
                }

                const matchId = notif.data ? notif.data.id : notif.id

                if (matchId && !(lastRoute.match && lastRoute.match.id === matchId)) {
                    console.tron.log('OPEN ROUTE')
                    pushRoute({
                        match: {
                            id: matchId,
                            set_points: true
                        },
                        state: MATCH
                    })
                }

            }
        })
        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
            this.syncNotifications(token)
        })
    }

    render() {
        if (this.props.appConnected) {
            return <App />
        } else {
            return <LoadingScreen />
        }
    }
}


AppContainer.propTypes = {
    appConnected: PropTypes.bool,
    initApp: PropTypes.func,
    match: PropTypes.object,
    pushRoute: PropTypes.func,
    receiveNotification: PropTypes.func,
    route: PropTypes.object,
    saveNotifications: PropTypes.func,
    setTab: PropTypes.func,
    settings: PropTypes.object,
    updateFCMToken: PropTypes.func
}

export default connect(
    state => ({
        appConnected: state.appConnected,
        match: state.match,
        route: state.route,
        settings: state.settings
    }),
    dispatch => ({
        initApp: () => dispatch(actions.initApp()),
        pushRoute: (route) => dispatch(actions.pushRoute(route)),
        receiveNotification: (notif) => dispatch(actions.receiveNotification(notif)),
        saveNotifications: () => dispatch(actions.saveNotifications()),
        setTab: (idx) => dispatch(actions.setTab(idx)),
        updateFCMToken: (token) => dispatch(actions.updateFCMToken(token))
    })
)(AppContainer)
