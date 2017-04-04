import React, { Component, PropTypes } from 'react'
import { View, Platform, BackAndroid, PanResponder } from 'react-native'
import { connect } from 'react-redux'
import { addNavigationHelpers, NavigationActions } from 'react-navigation'
import { ANDROID } from './consts'
import actions from './store/actions'
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from 'react-native-fcm'
import Navigator from './Navigator'
import Loading from './modals/LoadingModal'


class AppContainer extends Component {

    componentDidMount() {
        this.mountNotification()
        this.props.initApp()
        if (Platform.OS === ANDROID) {
            BackAndroid.addEventListener('hardwareBackPress', () => {
                // const route = findOpenRoute(this.props.nav)
                // if (route.routeName === 'Played' || route.routeName === 'Next') {

                // }

                this.props.dispatch({ type: NavigationActions.BACK })
                console.tron.log(`close ${this.props.nav.closeApp}`)
                if (this.props.nav.closeApp) {
                    BackAndroid.exitApp()
                }

                return true
            })
            this._panResponder = PanResponder.create({
                onPanResponderStart: (e, gestureState) => {
                    console.tron.log(e)
                    console.tron.log(gestureState)
                }
            })
        }
    }

    componentWillUnmount() {
        if (this.refreshTokenListener) {
            this.refreshTokenListener.remove()
        }
        if (this.notificationListener) {
            this.notificationListener.remove()
        }
        if (Platform.OS === ANDROID) {
            BackAndroid.removeEventListener('hardwareBackPress')
        }
    }

    syncNotifications(token) {
        if (token) {
            this.props.updateFCMToken(token)
            if (this.props.settings.notification.leagues) {
                // console.tron.log('FCM TOKEN RECEIVED AND NOTIFICATION INITIALIZED')
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
            const openRoute = findOpenRoute(this.props.nav)
            const isMatchRoute = openRoute.routeName.indexOf('Match') !== -1
            const matchId = parseInt(notif.data ? notif.data.id : notif.id)

            if (notif.type && !notif.local_notification && !notif._completionHandlerId) {
                this.props.receiveNotification(notif)
                if (isMatchRoute && openRoute.params.id === matchId && !this.props.match.ignoreNextNotify) {
                    this.props.dispatch(actions.getMatch(matchId))
                }
            }


            if (notif.opened_from_tray) {
                const { pushRoute } = this.props


                console.tron.log(openRoute)

                if (matchId) {
                    if (!isMatchRoute || openRoute.params.id !== matchId) {
                        pushRoute({
                            routeName: 'OverviewMatch',
                            params: {
                                id: matchId
                            }
                        })
                    }
                }

            }
        })
        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
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
                        state: nav
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
