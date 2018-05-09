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

import {
  Content,
  Icon,
  ListItem,
  Separator,
  Switch,
  TeamLogo,
  Text,
  Touchable,
} from '@app/components';
import { headerNavigationOptions } from '@app/containers/navigation';
import { Strings } from '@app/lib/strings';
import { navigate, showLogin } from '@app/redux/modules/navigation';
import * as SettingsActions from '@app/redux/modules/settings';
import {
  getColor,
  getUserTeams,
  userRemoveTeam,
  userSetActiveTeam,
} from '@app/redux/modules/user';
import { Routes } from '@app/scenes/routes';
import * as React from 'react';
import { Alert, View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { connect, Dispatch } from 'react-redux';

import { SettingsNotificationCompetitions } from './scenes/competitions';
import { SettingsNotiticationTeams } from './scenes/teams';

interface ISettingsProps extends IStateProps, IDispatchProps {}

class SettingsScene extends React.Component<ISettingsProps> {
  public render() {
    return (
      <Content>
        <ListItem.Group>
          <ListItem.Header title={Strings.USER_DATA} />
          {this.renderUser()}
        </ListItem.Group>
        <Separator group />
        {this.renderNotifications()}
        <Separator group />
        {this.renderInformation()}
      </Content>
    );
  }

  private onToggleNotificaiton = (key: string) => () => {
    this.props.toggleNotification(key);
  };

  private onPressTeam = (team: any, idx: number) => () => {
    this.props.setActiveTeam(idx);
    if (!team.access) {
      this.props.navigate({
        params: { headerLeft: null },
        routeName: Routes.login,
      });
    }
  };

  private onPressDelete = (team: any, idx: number) => () => {
    Alert.alert(
      Strings.CONFIRM_DELETE_TEAM_TITLE,
      Strings.CONFIRM_DELETE_TEAM_MESSAGE.replace('{{team}}', team.name),
      [
        { text: Strings.NO },
        {
          onPress: () => {
            this.props.unsubscribeTeam(team);
            this.props.removeTeam(idx);
          },
          text: Strings.YES,
        },
      ],
      { cancelable: true },
    );
  };

  private onSelectGroups = () => {
    this.props.navigate({
      routeName: Routes.settingsNotifications,
    });
  };

  private renderUser() {
    const { teams, color, active, login } = this.props;
    if (teams.length > 0) {
      return (
        <View>
          {teams.map((team, idx) => (
            <ListItem key={team.id}>
              <TeamLogo team={team.emblemUrl} left />
              <Touchable
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                onPress={this.onPressTeam(team, idx)}
              >
                {active === idx && (
                  <Icon
                    style={{ marginRight: 4 }}
                    color={team.color}
                    name="checkmark-circle"
                  />
                )}
                <Text style={{ flex: 1 }}>{team.name}</Text>
                {!team.access && (
                  <ListItem.Icon name="key" color={team.color} />
                )}
              </Touchable>
              <Touchable onPress={this.onPressDelete(team, idx)}>
                <ListItem.Icon name="trash" right color={team.color} />
              </Touchable>
            </ListItem>
          ))}
          {teams[teams.length - 1].access && (
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
        <Text>{Strings.SELECT_TEAM}</Text>
      </ListItem>
    );
  }

  private renderCheckbox(
    title: string,
    value: boolean,
    key: string,
    disabled: boolean,
  ) {
    return (
      <ListItem disabled={disabled}>
        <Switch
          title={title}
          value={value}
          disabled={disabled}
          onValueChange={this.onToggleNotificaiton(key)}
        />
      </ListItem>
    );
  }

  private renderNotifications() {
    const { fcm_token } = this.props.settings;
    const {
      notificationEnabled,
      notificationInterim,
      notificationFinal,
    } = this.props;

    return (
      <ListItem.Group>
        <ListItem.Header title={Strings.NOTIFICATIONS} />
        {this.renderCheckbox(
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
          !notificationEnabled,
        )}
        <Separator />
        <ListItem onPress={this.onSelectGroups} disabled={!notificationEnabled}>
          <Text style={{ flex: 1 }}>{Strings.SELECT_TEAMS}</Text>
          <ListItem.Icon right name="caret-forward" />
        </ListItem>
      </ListItem.Group>
    );
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
}

interface IStateProps {
  color: string;
  teams: any[];
  active: number;
  settings: any;
  notificationEnabled: boolean;
  notificationInterim: boolean;
  notificationFinal: boolean;
}
interface IDispatchProps {
  navigate: (route: any) => void;
  setActiveTeam: (index: number) => void;
  login: () => void;
  unsubscribeTeam: (team: any) => void;
  removeTeam: (team: any) => void;
  toggleNotification: (key: string) => void;
}

function mapStateToProps(state: any): IStateProps {
  return {
    active: state.user.active,
    color: getColor(state),
    notificationEnabled: SettingsActions.notificationEnabled(state),
    notificationFinal: SettingsActions.notificationFinalResults(state),
    notificationInterim: SettingsActions.notificationInterimResults(state),
    settings: state.settings,
    teams: getUserTeams(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): IDispatchProps {
  return {
    login: () => dispatch(showLogin()),
    navigate: (route: any) => dispatch(navigate(route)),
    removeTeam: (index: number) => dispatch(userRemoveTeam(index)),
    setActiveTeam: (index: number) => dispatch(userSetActiveTeam(index)),
    toggleNotification: (key: string) =>
      dispatch(SettingsActions.toggleNotification(key)),
    unsubscribeTeam: (team: any) =>
      dispatch(SettingsActions.unsubscribeTeam(team)),
  };
}

export const Settings = StackNavigator(
  {
    [Routes.settings]: {
      navigationOptions: { title: Strings.SETTINGS },
      screen: connect(mapStateToProps, mapDispatchToProps)(SettingsScene),
    },
    [Routes.settingsNotifications]: {
      navigationOptions: { title: Strings.NOTIFICATIONS },
      screen: SettingsNotificationCompetitions,
    },
    [Routes.settingsNotificationsTeams]: {
      navigationOptions: { title: Strings.SELECT_TEAMS },
      screen: SettingsNotiticationTeams,
    },
  },
  headerNavigationOptions,
);
