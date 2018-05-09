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
  ListItem,
  Separator,
  Switch,
  TeamLogo,
} from '@app/components';
import { getNavigationStateParams } from '@app/redux/modules/navigation';
import {
  notificationSubscribedForTeam,
  subscribeTeam,
  unsubscribeTeam,
} from '@app/redux/modules/settings';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'react-redux';

interface IProps extends IStateProps, IDispatchProps {
  navigation: any;
}

class SettingsTeams extends React.PureComponent<IProps> {
  public render() {
    return (
      <Content
        data={this.props.teams}
        renderItem={this.renderRow}
        renderSeparator={Separator}
      />
    );
  }

  private onToggleNotification = (team: any) => () => {
    if (team.subscribed) {
      this.props.unsubscribeTeam(team);
    } else {
      this.props.subscribeTeam(team);
    }
  };

  private renderRow = ({ item }: { item: any }) => {
    return (
      <ListItem>
        <TeamLogo team={item.emblemUrl} />
        <Switch
          title={item.name}
          value={item.subscribed}
          onValueChange={this.onToggleNotification(item)}
        />
      </ListItem>
    );
  };
}

interface IStateProps {
  teams: any[];
}

interface IDispatchProps {
  subscribeTeam: (team: any) => void;
  unsubscribeTeam: (team: any) => void;
}

function mapStateToProps(state: any, props: IProps): IStateProps {
  const teams = state.drawer[
    getNavigationStateParams(props.navigation).competitionId
  ]
    ? state.drawer[getNavigationStateParams(props.navigation).competitionId]
        .teams
    : [];
  const mapedTeams: any[] = [];
  for (const team of teams) {
    const subscribed = notificationSubscribedForTeam(state, team);
    mapedTeams.push({
      ...team,
      subscribed,
    });
  }
  return {
    teams: mapedTeams,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): IDispatchProps {
  return {
    subscribeTeam: (team: any) => dispatch(subscribeTeam(team)),
    unsubscribeTeam: (team: any) => dispatch(unsubscribeTeam(team)),
  };
}

export const SettingsNotiticationTeams = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsTeams);
