import React, { Component, PropTypes } from 'react'
import { View, Switch, Platform, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import actions from '../../store/actions'
// import codePush from 'react-native-code-push'
import { ListItem, Text } from '../../components/base'
import { Container } from '../../components'
import * as theme from '../../components/base/theme'
import { StackNavigator, NavigationActions } from 'react-navigation'
import SettingsNotificationView from './SettingsNotificationView'
import NavHeader from '../../Nav/NavHeader'
import NavDrawerIcon from '../../Nav/NavDrawerIcon'
import { SETTINGS, SETTINGS_NOTIFICATIONS, MODAL_LOGIN } from '../routes'

class SettingsView extends Component {



    _logout() {
        this.props.logout()
    }

    _login() {
        this.props.showLogin(true)
    }
    loginView() {
        this.props.pushRoute({
            routeName: MODAL_LOGIN,
            action: NavigationActions.navigate({ routeName: 'LoginView' })
        })
    }

    componentDidMount() {
        const { leagues, getRankings } = this.props

        if (Object.keys(leagues).length === 0) {
            getRankings()
        }
    }

    _toggleNotification(key, value) {
        this.props.setNotification(key, value)
        this.props.saveNotifications()
    }

    _renderCheckbox(text, value, key, disabled) {
        return (
            <ListItem
                disabled={disabled}
                onPress={Platform.OS === 'android' ? () => {
                    this._toggleNotification(key, !value)
                } : null}>
                <Text>{ text }</Text>
                <View style={{ flex: 1 }} />
                <Switch value={value} disabled={disabled} onValueChange={(newValue) => this._toggleNotification(key, newValue)} />
            </ListItem>)
    }

    _toggleGroups() {
        this.props.pushRoute({
            routeName: SETTINGS_NOTIFICATIONS
        })
    }

    _renderSectionNotification() {
        const notification = this.props.settings.notification
        const disabled = !notification.on || !this.props.settings.fcm_token

        return (
        <ListItem.Group>
            <ListItem.Header title='Benachrichtigungen' />
            { this._renderCheckbox('Benachrichtigungen', notification.on, 'on', !this.props.settings.fcm_token) }
            { this._renderCheckbox('Live-Zwischenergebnis', notification.live, 'live', disabled) }
            { this._renderCheckbox('Endstand', notification.ended, 'ended', disabled) }
            <ListItem last
                disabled={disabled || Object.keys(this.props.leagues).length === 0}
                onPress={this._toggleGroups.bind(this)}>
                <Text>Gruppen wählen</Text>
                <View style={{ flex:1 }} />
                { this.props.loading && (<ActivityIndicator color={theme.secondaryTextColor} />)}
                { !this.props.loading && (<ListItem.Icon name='caret-forward' right />) }
            </ListItem>
        </ListItem.Group>)
    }

    render() {
        const team = this.props.settings.team

        return (
            <Container {...this.props}>
                <ListItem.Group>
                    <ListItem.Header title='Benutzerdaten' />
                { team && (
                    <View>
                        <ListItem icon>
                            { !!team.image && (<ListItem.Image url={team.image} />)}
                            { !team.image && (<ListItem.Icon name='shirt' color={this.props.settings.color} />)}
                            <Text>{ team.name }</Text>
                        </ListItem>
                        { !this.props.auth.api_key && (
                            <ListItem icon onPress={this.loginView.bind(this)}>
                                <ListItem.Icon name='key' color={this.props.settings.color} />
                                    <Text>Zugangsdaten eingeben</Text>
                            </ListItem>
                        )}
                        <ListItem last onPress={this._logout.bind(this)}>
                            <ListItem.Icon name='log-out' color={this.props.settings.color} />
                            <Text>Abmelden</Text>
                        </ListItem>
                    </View>
                )}
                { !team && (
                    <ListItem last onPress={this._login.bind(this)}>
                        <ListItem.Icon name='log-in' color={this.props.settings.color} />
                        <Text>Team wählen</Text>
                    </ListItem>
                )}
                </ListItem.Group>

                { this._renderSectionNotification() }

                <ListItem.Group>
                    <ListItem.Header title='Informationen' />
                    <ListItem last>
                        <ListItem.Icon name='information-circle' color={this.props.settings.color} />
                        <Text>App-Version 0.10</Text>
                    </ListItem>

                </ListItem.Group>
            </Container>
        )
    }

}


SettingsView.propTypes = {
    auth: PropTypes.object,
    getRankings: PropTypes.func,
    leagues: PropTypes.object,
    logout: PropTypes.func,
    pushRoute: PropTypes.func,
    saveNotifications: PropTypes.func,
    setNotification: PropTypes.func,
    settings: PropTypes.object,
    showLogin: PropTypes.func
}

export default connect(
    state => ({
      loading: state.loading.nonBlocking,
        auth: state.auth,
        dialog: state.dialog,
        leagues: state.leagues,
        settings: state.settings
    }),
    dispatch => ({
        getRankings: () => dispatch(actions.getRankings()),
        logout: () => dispatch(actions.logout()),
        pushRoute: (route) => dispatch(NavigationActions.navigate(route)),
        saveNotifications: () => dispatch(actions.saveNotifications()),
        setNotification: (key, value) => dispatch(actions.setNotification(key, value)),
        showLogin: (show) => dispatch(actions.showLogin(show))
    })
    )(SettingsView)
