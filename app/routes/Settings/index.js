import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import {
  Container,
  ListItem,
  Text,
  Switch,
  Separator,
  Icon,
  TeamLogo,
  Touchable,
} from '../../components';
import * as NavigationActions from '../../redux/modules/navigation';
import * as AuthActions from '../../redux/modules/auth';
import * as SettingsActions from '../../redux/modules/settings';
import S from '../../lib/strings';

import Routes from '../../config/routes';
import {
  getColor,
  getUserTeams,
  userRemoveTeam,
  userSetActiveTeam,
} from '../../redux/modules/user';

class Settings extends React.Component {
  onSelectGroups = () => {
    this.props.navigate({
      routeName: Routes.SETTINGS_NOTIFICATIONS,
    });
  };

  renderUser() {
    const { teams, color, active } = this.props;
    if (teams.length > 0) {
      return (
        <View>
          {teams.map((team, idx) =>
            <ListItem key={team.id}>
              <TeamLogo team={team.emblemUrl} left />
              <Touchable
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                onPress={() => {
                  this.props.setActiveTeam(idx);
                  if (!team.access) {
                    this.props.login();
                  }
                }}
              >
                {active === idx &&
                  <Icon
                    style={{ marginRight: 4 }}
                    color={team.color}
                    name="checkmark-circle"
                  />}
                <Text style={{ flex: 1 }}>
                  {team.name}
                </Text>
                {!team.access &&
                  <ListItem.Icon name="key" color={team.color} />}
              </Touchable>
              <Touchable onPress={() => this.props.removeTeam(idx)}>
                <ListItem.Icon name="trash" right color={team.color} />
              </Touchable>
            </ListItem>,
          )}
          {teams[teams.length - 1].access &&
            <View>
              <Separator image />

              <ListItem onPress={this.props.login}>
                <ListItem.Icon name="add" color={color} />
                <Text>
                  {`Weiteres Team hinzufügen`}
                </Text>
              </ListItem>
            </View>}
          {/* {!auth.api_key &&
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
          </ListItem> */}
        </View>
      );
    }

    return (
      <ListItem onPress={this.props.login}>
        <ListItem.Icon name="add" color={color} />
        <Text>
          {S.SELECT_TEAM}
        </Text>
      </ListItem>
    );
  }

  renderNotifications() {
    const { fcm_token } = this.props.settings;

    const {
      notificationEnabled,
      // notificationSound,
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
        {/* {this.renderCheckbox(
          S.NOTIFICATION_SOUND,
          notificationSound,
          'sound',
          !notificationEnabled,
        )}
        <Separator /> */}
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
    const { color } = this.props;
    return (
      <ListItem.Group>
        <ListItem.Header title={S.INFORMATION} />
        <ListItem>
          <ListItem.Icon name="information-circle" color={color} />
          <Text>
            {`${S.APP_VERSION}`}
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
    color: getColor(state),
    teams: getUserTeams(state),
    active: state.user.active,
    auth: state.auth,
    settings: state.settings,
    notificationEnabled: SettingsActions.notificationEnabled(state),
    notificationSound: SettingsActions.notificationSound(state),
    notificationInterim: SettingsActions.notificationInterimResults(state),
    notificationFinal: SettingsActions.notificationFinalResults(state),
  }),
  dispatch => ({
    removeTeam: index => dispatch(userRemoveTeam(index)),
    setActiveTeam: index => dispatch(userSetActiveTeam(index)),
    login: () => dispatch(NavigationActions.showLogin()),
    logout: () => dispatch(AuthActions.logout()),
    navigate: route => dispatch(NavigationActions.navigate(route)),
    toggleNotification: key =>
      dispatch(SettingsActions.toggleNotification(key)),
  }),
)(Settings);
