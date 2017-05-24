import React, { Component } from 'react';
import { View, Platform, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import { ListItem, Text, Switch, Separator, Column } from '../../components/base';
import { Container } from '../../components';
import * as theme from '../../components/base/theme';
import { NavigationActions } from 'react-navigation';
import { SETTINGS_NOTIFICATIONS, MODAL_LOGIN } from '../routes';
import strings from '../../Strings';


class SettingsView extends Component {
  _logout() {
    this.props.logout();
  }

  _login() {
    this.props.showLogin(true);
  }
  loginView() {
    this.props.pushRoute({
      routeName: MODAL_LOGIN,
      action: NavigationActions.navigate({ routeName: 'LoginView' })
    });
  }


  componentDidMount() {
    const { leagues, getRankings } = this.props;

    if (Object.keys(leagues).length === 0) {
      getRankings();
    }
  }

  _toggleNotification(key, value) {
    this.props.setNotification(key, value);
    this.props.saveNotifications();
  }

  _renderCheckbox(text, value, key, disabled) {
    return (
      <ListItem
        disabled={disabled}
        onPress={
          Platform.OS === 'android'
            ? () => {
                this._toggleNotification(key, !value);
              }
            : null
        }
      >
        <Text>{text}</Text>
        <View style={{ flex: 1 }} />
        <Switch
          value={value}
          disabled={disabled}
          onValueChange={newValue => this._toggleNotification(key, newValue)}
        />
      </ListItem>
    );
  }

  _toggleGroups() {
    this.props.pushRoute({
      routeName: SETTINGS_NOTIFICATIONS
    });
  }

  _renderSectionNotification() {
    const notification = this.props.settings.notification;
    const disabled = !notification.on || !this.props.settings.fcm_token;

    return (
      <ListItem.Group>
        <ListItem.Header title="Benachrichtigungen" />
        {this._renderCheckbox(
          'Benachrichtigungen',
          notification.on,
          'on',
          !this.props.settings.fcm_token
        )}
        <Separator />
        {this._renderCheckbox(
          'Live-Zwischenergebnis',
          notification.live,
          'live',
          disabled
        )}
        <Separator />
        {this._renderCheckbox(
          'Endstand',
          notification.ended,
          'ended',
          disabled
        )}
        <Separator />
        <ListItem
          disabled={disabled || Object.keys(this.props.leagues).length === 0}
          onPress={this._toggleGroups.bind(this)}
        >
          <Text>Gruppen wählen</Text>
          <View style={{ flex: 1 }} />
          {this.props.loading &&
            Object.keys(this.props.leagues).length === 0 &&
            <ActivityIndicator color={theme.secondaryTextColor} />}
          {Object.keys(this.props.leagues).length > 0 &&
            <ListItem.Icon name="caret-forward" right />}
        </ListItem>
      </ListItem.Group>
    );
  }

  render() {
    const team = this.props.settings.team;

    return (
      <Container {...this.props}>
        <ListItem.Group>
          <ListItem.Header title="Benutzerdaten" />
          {team &&
            <View>
              <ListItem icon>
                {!!team.image && <ListItem.Image url={team.image} />}
                {!team.image &&
                  <ListItem.Icon
                    name="shirt"
                    color={this.props.settings.color}
                  />}
                <Text>{team.name}</Text>
              </ListItem>
              <Separator image />
              {!this.props.auth.api_key &&
                <ListItem icon onPress={this.loginView.bind(this)}>
                  <ListItem.Icon name="key" color={this.props.settings.color} />
                  <Text>Zugangsdaten eingeben</Text>
                </ListItem>}
                {!this.props.auth.api_key && (<Separator image />)}
              <ListItem onPress={this._logout.bind(this)}>
                <ListItem.Icon
                  name="log-out"
                  color={this.props.settings.color}
                />
                <Text>Abmelden</Text>
              </ListItem>
            </View>}
          {!team &&
            <ListItem onPress={this._login.bind(this)}>
              <ListItem.Icon name="log-in" color={this.props.settings.color} />
              <Text>Team wählen</Text>
            </ListItem>}
        </ListItem.Group>
        <Separator group />
        {this._renderSectionNotification()}
        <Separator group />
        <ListItem.Group>
          <ListItem.Header title="Informationen" />
          <ListItem onPress={this.props.clearImageCache.bind(this)}>
            <ListItem.Icon name='trash' color={this.props.settings.color} />
              <Text style={{ paddingTop: 8, paddingBottom: 8}}>{ strings.clear_image_cache }</Text>
          </ListItem>
          <ListItem multiline>
            <Text small secondary>
              { strings.cache_information }
            </Text>
          </ListItem>
          <Separator />
          <ListItem>
            <ListItem.Icon
              name="information-circle"
              color={this.props.settings.color}
            />
            <Text>{strings.app_version}</Text>
          </ListItem>
        </ListItem.Group>
      </Container>
    );
  }
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
    clearImageCache: () => dispatch(actions.clearImageCache()),
    pushRoute: route => dispatch(NavigationActions.navigate(route)),
    saveNotifications: () => dispatch(actions.saveNotifications()),
    setNotification: (key, value) =>
      dispatch(actions.setNotification(key, value)),
    showLogin: show => dispatch(actions.showLogin(show))
  })
)(SettingsView);
