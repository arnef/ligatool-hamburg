import React, { Component, PropTypes } from 'react'
import { View, Platform, BackAndroid } from 'react-native'
import { connect } from 'react-redux'
import { addNavigationHelpers, NavigationActions } from 'react-navigation'
import actions from './store/actions'
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm'
import Navigator from './Navigator'
import Loading from './modals/LoadingModal'
import { ANDROID, IOS } from './consts'


class AppContainer extends Component {

    componentDidMount() {
        this.mountNotification()
        this.props.initApp()

        BackAndroid.addEventListener('hardwareBackPress', () => {
            if (this.props.nav.actionStack.length === 0 && !this.props.nav.drawerOpen) {
                BackAndroid.exitApp()
                this.props.dispatch({ type: NavigationActions.BACK })

                return false
            } else {
                this.props.dispatch({ type: NavigationActions.BACK })

                return true
            }
        })

    }

    componentWillUnmount() {
        if (this.refreshTokenListener) {
            this.refreshTokenListener.remove()
        }
        if (this.notificationListener) {
            this.notificationListener.remove()
        }
        BackAndroid.removeEventListener('hardwareBackPress')
    }

    syncNotifications(token) {
      console.tron.log('received token: ' + token)

        if (token) {

            // this.props.updateFCMToken(token)
            if (this.props.settings.notification.leagues) {
                console.tron.log('FCM TOKEN RECEIVED AND NOTIFICATION INITIALIZED')
                // this.props.saveNotifications()
            }
        }
    }

    handleNotification(notif) {
        if (!notif) {
            return
        }

        if (Platform.OS === IOS) {
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
        const { nav, match, receiveNotification, dispatch, pushRoute } = this.props
        const currentRoute = nav.currentRoute
        const isMatchRoute = currentRoute.routeName.indexOf('Match') !== -1
        const matchId = parseInt(notif.data ? notif.data.id : notif.id)

        console.tron.log(notif)

        // fire local notification on android
        if (Platform.OS === ANDROID && notif.fcm && notif.fcm.tag) {
            const localNotif = { ...notif.fcm }

            localNotif.vibrate = 0
            localNotif.id = notif.id
            localNotif.data = { id: notif.id, type: notif.type }
            localNotif.show_in_foreground = true
            if (!(match.ignoreNextNotify && isMatchRoute && currentRoute.params.id === matchId)) {
                FCM.presentLocalNotification(localNotif)
            }
        }

        if (notif.type && !notif.local_notification && !notif._completionHandlerId) {
            // send notification to redux
            receiveNotification(notif)
            // get match if recevied match is open
            if (isMatchRoute && currentRoute.params.id === matchId && !match.ignoreNextNotify) {
                dispatch(actions.getMatch(matchId))
            }
        }

        if (notif.opened_from_tray && matchId && (!isMatchRoute || currentRoute.params.id !== matchId)) {
            console.tron.log('open match')
            //TODO check if user is admin for match
            pushRoute({
                routeName: 'OverviewMatch',
                params: {
                    id: matchId
                }
            })
        }
    }

    mountNotification() {
        FCM.requestPermissions()
        FCM.getInitialNotification().then(notif => {
            console.tron.log('get initial notification')
            this.handleNotification(notif)
        })
        FCM.getFCMToken().then(token => {
            this.syncNotifications(token)
        })
        this.notificationListener = FCM.on(FCMEvent.Notification, notif => {
            console.tron.log('notification listener')
            this.handleNotification(notif)
        })
        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
            this.syncNotifications(token)
        })
    }

    render() {
        const { dispatch, nav } = this.props

        return (
            <View style={{ flex: 1 }}>
                <Loading />
                <Navigator
                    navigation={ addNavigationHelpers({
                        dispatch,
                        state: nav.state
                    })} />
            </View>
        )
    }
}

const findOpenRoute = (state) => {
    if (state.routes) {
        return findOpenRoute(state.routes[state.index])
    }

    return state
}

AppContainer.propTypes = {
    appConnected: PropTypes.bool,
    dispatch: PropTypes.func,
    initApp: PropTypes.func,
    match: PropTypes.object,
    nav: PropTypes.object,
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
        nav: state.nav,
        settings: state.settings
    }),
    dispatch => ({
        dispatch: (action) => dispatch(action),
        initApp: () => dispatch(actions.initApp()),
        pushRoute: (route) => dispatch(NavigationActions.navigate(route)),
        receiveNotification: (notif) => dispatch(actions.receiveNotification(notif)),
        saveNotifications: () => dispatch(actions.saveNotifications()),
        setTab: (idx) => dispatch(actions.setTab(idx)),
        updateFCMToken: (token) => dispatch(actions.updateFCMToken(token))
    })
)(AppContainer)
