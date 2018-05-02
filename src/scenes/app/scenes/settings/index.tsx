/**
 * Copyright (C) 2018 Arne Feil
 * 
 * This file is part of DTFB App.
 * 
 * DTFB App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * DTFB App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with DTFB App.  If not, see <http://www.gnu.org/licenses/>.
 * 
 */

import * as React from 'react';
import { View, Alert } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { Routes } from '../../../routes';
import { ListItem, TeamLogo, Touchable, Icon, Text, Separator, Switch, Content } from '../../../../components';
import { Strings } from 'src/lib/strings'
import { getColor, getUserTeams, userRemoveTeam, userSetActiveTeam } from 'src/redux/modules/user';
import * as SettingsActions from 'src/redux/modules/settings';
import { showLogin, navigate } from 'src/redux/modules/navigation';

import { SettingsNotificationCompetitions } from './scenes/competitions'
import { SettingsNotiticationTeams } from './scenes/teams';
import { headerNavigationOptions } from '../../../../containers/navigation';

interface SettingsProps extends StateProps, DispatchProps {

}
class SettingsScene extends React.Component<SettingsProps> {

  private onSelectGroups = () => {
    this.props.navigate({
      routeName: Routes.settingsNotifications,
    });
  }

  private renderUser() {
    const { teams, color, active, setActiveTeam, login, unsubscribeTeam, removeTeam } = this.props;
    if (teams.length > 0) {
      return (
        <View>
          { teams.map((team, idx) => (
            <ListItem key={team.id}>
              <TeamLogo team={team.emblemUrl} left />
              <Touchable
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                onPress={() => {
                  setActiveTeam(idx);
                  if (!team.access) {
                    login();
                  }
                }}
              >
                { active === idx && (
                  <Icon style={{ marginRight: 4 }} color={team.color} name="checkmark-circle" />
                )}
                <Text style={{ flex: 1 }}>{ team.name }</Text>
                {!team.access && (
                  <ListItem.Icon name="key" color={team.color} />
                )}
              </Touchable>
              <Touchable
                onPress={() => {
                  Alert.alert(
                    Strings.CONFIRM_DELETE_TEAM_TITLE,
                    Strings.CONFIRM_DELETE_TEAM_MESSAGE.replace('{{team}}', team.name),
                    [{ text: Strings.NO }, { text: Strings.YES, onPress: () => {
                      unsubscribeTeam(team);
                      removeTeam(idx);
                    } }],
                    { cancelable: true }
                  );
                }}
              >
                <ListItem.Icon name="trash" right color={team.color} />
              </Touchable>
            </ListItem>
          ))}
          { teams[teams.length - 1].access && (
            <View>
              <Separator image />
              <ListItem onPress={login}>
                <ListItem.Icon name="add" color={color} />
                <Text>{Strings.ADD_TEAM}</Text>
              </ListItem>
            </View>
          )}
        </View>
      );
    }
    return (
      <ListItem onPress={login}>
        <ListItem.Icon name="add" color={color} />
        <Text>{ Strings.SELECT_TEAM }</Text>
      </ListItem>
    );
  }

  private renderCheckbox(title: string, value: boolean, key: string, disabled: boolean) {
    return (
      <ListItem disabled={disabled}>
        <Switch
          title={title}
          value={value}
          disabled={disabled}
          onValueChange={() => this.props.toggleNotification(key)}
        />
      </ListItem>
    )
  }

  private renderNotifications() {
    const { fcm_token } = this.props.settings;
    const { notificationEnabled, notificationInterim, notificationFinal } = this.props;

    return (
      <ListItem.Group>
        <ListItem.Header title={Strings.NOTIFICATIONS} />
        { this.renderCheckbox(
          Strings.NOTIFICATIONS,
          notificationEnabled,
          'enabled',
          !fcm_token,
        )}
        <Separator />
        {this.renderCheckbox(
          Strings.NOTIFICATION_LIVE,
          notificationInterim,
          'interimResults',
          !notificationEnabled,
        )}
        <Separator />
        {this.renderCheckbox(
          Strings.NOTIFICATION_END,
          notificationFinal,
          'finalResults',
          !notificationEnabled
        )}
        <Separator />
        <ListItem onPress={this.onSelectGroups} disabled={!notificationEnabled}>
          <Text style={{ flex: 1}}>{ Strings.SELECT_TEAMS }</Text>
          <ListItem.Icon right name="caret-forward" />
        </ListItem>
      </ListItem.Group>
    )
  }

  private renderInformation() {
    const { color } = this.props;
    return (
      <ListItem.Group>
        <ListItem.Header title={Strings.INFORMATION} />
        <ListItem>
          <ListItem.Icon name="information-circle" color={color} />
          <Text>{`${Strings.APP_VERSION}`}</Text>
        </ListItem>
      </ListItem.Group>
    );
  }

  public render() {
    return (
      <Content>
        <ListItem.Group>
          <ListItem.Header title={Strings.USER_DATA} />
          { this.renderUser() }
        </ListItem.Group>
        <Separator group />
        { this.renderNotifications() }
        <Separator group />
        { this.renderInformation() }
      </Content>
    );
  }
}

interface StateProps {
  color: string,
  teams: Array<any>
  active: number
  settings: any
  notificationEnabled: boolean
  notificationInterim: boolean
  notificationFinal: boolean
}
interface DispatchProps {
  navigate: Function
  setActiveTeam: Function
  login: Function
  unsubscribeTeam: Function
  removeTeam: Function
  toggleNotification: Function
}

function mapStateToProps(state) {
  return {
    color: getColor(state),
    teams: getUserTeams(state),
    active: state.user.active,
    settings: state.settings,
    notificationEnabled: SettingsActions.notificationEnabled(state),
    notificationInterim: SettingsActions.notificationInterimResults(state),
    notificationFinal: SettingsActions.notificationFinalResults(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    removeTeam: (index: number) => dispatch(userRemoveTeam(index)),
    unsubscribeTeam: (team: any) => dispatch(SettingsActions.unsubscribeTeam(team)),
    setActiveTeam: (index: number) => dispatch(userSetActiveTeam(index)),
    login: () => dispatch(showLogin()),
    navigate: (route) => dispatch(navigate(route)),
    toggleNotification: (key: string) => dispatch(SettingsActions.toggleNotification(key)),
  }
}

export const Settings = StackNavigator({
  [Routes.settings]: {
    screen: connect(mapStateToProps, mapDispatchToProps)(SettingsScene),
    navigationOptions: { title: Strings.SETTINGS }
  },
  [Routes.settingsNotifications]: {
    screen: SettingsNotificationCompetitions,
    navigationOptions: { title: Strings.NOTIFICATIONS }
  },
  [Routes.settingsNotificationsTeams]: {
    screen: SettingsNotiticationTeams,
    navigationOptions: { title: Strings.SELECT_TEAMS },
  }
}, headerNavigationOptions);
// export const Settings = 