// @flow
import React from 'react';
import { View, Alert } from 'react-native';
import { connect } from 'react-redux';
import codePush from 'react-native-code-push';
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
import S from '../../lib/strings';

import Routes from '../../config/routes';

class Settings extends React.Component {
  state: { codepush: ?string };
  onLogin: Function;
  onSelectGroups: Function;
  onClearCache: Function;

  constructor(props) {
    super(props);
    this.state = { codepush: null };
    this.onSelectGroups = this.onSelectGroups.bind(this);
    this.onClearCache = this.onClearCache.bind(this);
  }

  componentWillMount() {
    codePush.getCurrentPackage().then(pkg => {
      if (pkg && !pkg.isPending && pkg.label && pkg.appVersion) {
        this.setState({
          codepush: `App-Version ${pkg.appVersion}-${pkg.label}`,
        });
      }
    });
  }

  onSelectGroups() {
    this.props.navigate({
      routeName: Routes.SETTINGS_NOTIFICATIONS,
    });
  }

  onClearCache() {
    Alert.alert(S.CLEAR_IMAGE_CACHE, S.CACHE_INFORMATION, [
      { text: S.CANCEL, onPress: () => {} },
      { text: S.DELETE, onPress: this.props.clearCache },
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
              <Text>
                {S.ENTER_ACCESS_DATA}
              </Text>
            </ListItem>}
          {!auth.api_key && <Separator image />}
          <ListItem onPress={this.props.logout}>
            <ListItem.Icon name="log-out" color={color} />
            <Text>
              {S.LOGOUT}
            </Text>
          </ListItem>
        </View>
      );
    }

    return (
      <ListItem onPress={this.props.login}>
        <ListItem.Icon name="log-in" color={color} />
        <Text>
          {S.SELECT_TEAM}
        </Text>
      </ListItem>
    );
  }

  renderNotifications() {
    const { notification, fcm_token } = this.props.settings;
    const disabled = !notification.on || !fcm_token;

    return (
      <ListItem.Group>
        <ListItem.Header title={S.NOTIFICATIONS} />
        {this.renderCheckbox(
          S.NOTIFICATIONS,
          notification.on,
          'on',
          !fcm_token,
        )}
        <Separator />
        {this.renderCheckbox(
          S.NOTIFICATION_LIVE,
          notification.live,
          'live',
          disabled,
        )}
        <Separator />
        {this.renderCheckbox(
          S.NOTIFICATION_END,
          notification.ended,
          'ended',
          disabled,
        )}
        <Separator />
        {this.renderCheckbox(
          S.NOTIFICATION_MATCH_DATE,
          notification.matchdate,
          'matchdate',
          !this.props.auth.api_key,
        )}
        <Separator />
        <ListItem onPress={this.onSelectGroups} disabled={disabled}>
          <Text style={{ flex: 1 }}>
            {S.SELECT_GROUPS}
          </Text>
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
        <ListItem.Header title={S.INFORMATION} />
        <ListItem onPress={this.onClearCache}>
          <ListItem.Icon name="trash" color={color} />
          <Text>
            {S.CLEAR_IMAGE_CACHE}
          </Text>
        </ListItem>
        <Separator image />
        <ListItem>
          <ListItem.Icon name="information-circle" color={color} />
          <Text>
            {`${this.state.codepush ? this.state.codepush : S.APP_VERSION}`}
          </Text>
        </ListItem>
      </ListItem.Group>
    );
  }

  render() {
    return (
      <Container>
        <ListItem.Group>
          <ListItem.Header title={S.USER_DATA} />
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
