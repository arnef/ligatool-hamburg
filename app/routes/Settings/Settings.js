// @flow
import React from 'react';
import { View, Alert } from 'react-native';
import { connect } from 'react-redux';
import {
  Container,
  ListItem,
  Text,
  Switch,
  Separator,
  TeamLogo,
} from '../../components';
import * as NavigationActions from '../../redux/modules/navigation';
import * as AuthActions from '../../redux/modules/auth';
import * as SettingsActions from '../../redux/modules/settings';
import strings from '../../lib/strings';

import Routes from '../../config/routes';

class Settings extends React.Component {
  onLogin: Function;
  onSelectGroups: Function;
  onClearCache: Function;

  constructor(props) {
    super(props);

    this.onSelectGroups = this.onSelectGroups.bind(this);
    this.onClearCache = this.onClearCache.bind(this);
  }

  onSelectGroups() {
    this.props.navigate({
      routeName: Routes.SETTINGS_NOTIFICATIONS,
    });
  }

  onClearCache() {
    Alert.alert(strings.clear_image_cache, strings.cache_information, [
      { text: 'Abbrechen', onPress: () => {} },
      { text: 'Löschen', onPress: this.props.clearCache },
    ]);
  }

  renderUser() {
    const { team, color } = this.props.settings;
    const { auth } = this.props;
    if (team) {
      return (
        <View>
          <ListItem>
            <TeamLogo team={team} />
            <Text>
              {team.name}
            </Text>
          </ListItem>
          <Separator image />
          {!auth.api_key &&
            <ListItem onPress={this.props.login}>
              <ListItem.Icon name="key" color={color} />
              <Text>Zugangsdaten eingeben</Text>
            </ListItem>}
          {!auth.api_key && <Separator image />}
          <ListItem onPress={this.props.logout}>
            <ListItem.Icon name="log-out" color={color} />
            <Text>Abmelden</Text>
          </ListItem>
        </View>
      );
    }

    return (
      <ListItem onPress={this.props.login}>
        <ListItem.Icon name="log-in" color={color} />
        <Text>Team wählen</Text>
      </ListItem>
    );
  }

  renderNotifications() {
    const { notification, fcm_token } = this.props.settings;
    const disabled = !notification.on || !fcm_token;

    return (
      <ListItem.Group>
        <ListItem.Header title="Benachrichtigungen" />
        {this.renderCheckbox(
          'Benachrichtigungen',
          notification.on,
          'on',
          !fcm_token,
        )}
        <Separator />
        {this.renderCheckbox(
          'Live-Zwischenergebnis',
          notification.live,
          'live',
          disabled,
        )}
        <Separator />
        {this.renderCheckbox('Endstand', notification.ended, 'ended', disabled)}
        <Separator />
        <ListItem onPress={this.onSelectGroups} disabled={disabled}>
          <Text style={{ flex: 1 }}>Gruppen wählen</Text>
          <ListItem.Icon name="caret-forward" right />
        </ListItem>
      </ListItem.Group>
    );
  }

  renderCheckbox(title, value, key, disabled) {
    return (
      <ListItem disabled={disabled}>
        <Switch
          title={title}
          value={value}
          disabled={disabled}
          onValueChange={() => this.props.toggleNotification(key)}
        />
      </ListItem>
    );
  }

  renderInformation() {
    const { color } = this.props.settings;
    return (
      <ListItem.Group>
        <ListItem.Header title="Informationen" />
        <ListItem onPress={this.onClearCache}>
          <ListItem.Icon name="trash" color={color} />
          <Text>
            {strings.clear_image_cache}
          </Text>
        </ListItem>
        <Separator image />
        <ListItem>
          <ListItem.Icon name="information-circle" color={color} />
          <Text>
            {strings.app_version}
          </Text>
        </ListItem>
      </ListItem.Group>
    );
  }

  render() {
    return (
      <Container>
        <ListItem.Group>
          <ListItem.Header title="Benutzerdaten" />
          {this.renderUser()}
        </ListItem.Group>
        <Separator group />
        {this.renderNotifications()}
        <Separator group />
        {this.renderInformation()}
      </Container>
    );
  }
}

export default connect(
  state => ({
    auth: state.auth,
    settings: state.settings,
  }),
  (dispatch: Dispatch<any>) => ({
    login: () => dispatch(NavigationActions.showLogin()),
    logout: () => dispatch(AuthActions.logout()),
    navigate: route => dispatch(NavigationActions.navigate(route)),
    toggleNotification: (key: string) =>
      dispatch(SettingsActions.toggleNotification(key)),
    clearCache: () => dispatch(SettingsActions.clearCache()),
  }),
)(Settings);
