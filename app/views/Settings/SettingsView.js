import React, { Component } from 'react';
import { View, Platform, ActivityIndicator, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Container, ListItem, Text, Switch, Separator } from '../../components';
import * as NavigationActions from '../../redux/modules/navigation';
import Routes from '../../config/routes';
import strings from '../../lib/strings';
import { colors } from '../../config/styles';

import * as LeagueActions from '../../redux/modules/leagues';
import * as SettingsActions from '../../redux/modules/settings';
import * as AuthActions from '../../redux/modules/auth';

class SettingsView extends Component {
  _logout() {
    this.props.logout();
  }

  _login() {
    this.props.showLogin();
    // this.props.navigation.navigate(MODAL_LOGIN);
  }
  loginView() {
    this.props.pushRoute({
      routeName: Routes.MODAL_LOGIN,
      action: NavigationActions.navigate({ routeName: 'LoginView' }),
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
        <Text>
          {text}
        </Text>
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
    this.props.navigation.navigate(Routes.SETTINGS_NOTIFICATIONS);
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
          !this.props.settings.fcm_token,
        )}
        <Separator />
        {this._renderCheckbox(
          'Live-Zwischenergebnis',
          notification.live,
          'live',
          disabled,
        )}
        <Separator />
        {this._renderCheckbox(
          'Endstand',
          notification.ended,
          'ended',
          disabled,
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
            <ActivityIndicator color={colors.TEXT_SECONDARY} />}
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
                <Text>
                  {team.name}
                </Text>
              </ListItem>
              <Separator image />
              {!this.props.auth.api_key &&
                <ListItem icon onPress={this.loginView.bind(this)}>
                  <ListItem.Icon name="key" color={this.props.settings.color} />
                  <Text>Zugangsdaten eingeben</Text>
                </ListItem>}
              {!this.props.auth.api_key && <Separator image />}
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
          <ListItem onPress={this.clearImageCache.bind(this)}>
            <ListItem.Icon name="trash" color={this.props.settings.color} />
            <Text style={{ paddingTop: 8, paddingBottom: 8 }}>
              {strings.clear_image_cache}
            </Text>
          </ListItem>
          <Separator image />
          <ListItem>
            <ListItem.Icon
              name="information-circle"
              color={this.props.settings.color}
            />
            <Text>
              {strings.app_version}
            </Text>
          </ListItem>
        </ListItem.Group>
      </Container>
    );
  }

  clearImageCache() {
    Alert.alert(strings.clear_image_cache, strings.cache_information, [
      { text: 'Abbrechen', onPress: () => {} },
      {
        text: 'Löschen',
        onPress: () => {
          this.props.clearImageCache();
        },
      },
    ]);
  }
}

export default connect(
  state => ({
    loading: state.loading.list,
    auth: state.auth,
    dialog: {}, //state.dialog,
    leagues: state.drawer,
    settings: state.settings,
  }),
  dispatch => ({
    getRankings: () => dispatch(LeagueActions.getLeagues()),
    logout: () => dispatch(AuthActions.logout()),
    clearImageCache: () => dispatch(SettingsActions.clearCache()),
    saveNotifications: () => dispatch({ type: 'INGORE' }),
    setNotification: key => dispatch(SettingsActions.toggleNotification(key)),
    showLogin: () => dispatch(NavigationActions.showLogin()),
    pushRoute: route => dispatch(NavigationActions.navigate(route)),
  }),
)(SettingsView);
