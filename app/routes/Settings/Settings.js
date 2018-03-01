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
          codepush: `App-Version ${pkg.appVersion} (${pkg.label})`,
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
            <TeamLogo team={team.emblemUrl} left />
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

    const {
      notificationEnabled,
      notificationSound,
      notificationInterim,
      notificationFinal,
    } = this.props;
    return (
      <ListItem.Group>
        <ListItem.Header title={S.NOTIFICATIONS} />
        {this.renderCheckbox(
          S.NOTIFICATIONS,
          notificationEnabled,
          'enabled',
          !fcm_token,
        )}
        <Separator />
        {this.renderCheckbox(
          S.NOTIFICATION_SOUND,
          notificationSound,
          'sound',
          !notificationEnabled,
        )}
        <Separator />
        {this.renderCheckbox(
          S.NOTIFICATION_LIVE,
          notificationInterim,
          'interimResults',
          !notificationEnabled,
        )}
        <Separator />
        {this.renderCheckbox(
          S.NOTIFICATION_END,
          notificationFinal,
          'finalResults',
          !notificationEnabled,
        )}
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
    notificationEnabled: SettingsActions.notificationEnabled(state),
    notificationSound: SettingsActions.notificationSound(state),
    notificationInterim: SettingsActions.notificationInterimResults(state),
    notificationFinal: SettingsActions.notificationFinalResults(state),
  }),
  dispatch => ({
    login: () => dispatch(NavigationActions.showLogin()),
    logout: () => dispatch(AuthActions.logout()),
    navigate: route => dispatch(NavigationActions.navigate(route)),
    toggleNotification: key =>
      dispatch(SettingsActions.toggleNotification(key)),
  }),
)(Settings);
