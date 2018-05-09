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

import { Content, ListItem, Separator, Text } from '@app/components';
import { Strings } from '@app/lib/strings';
import {
  getNavigationStateParams,
  navigate,
} from '@app/redux/modules/navigation';
import { getTeam } from '@app/redux/modules/teams';
import { getActiveTeam, getColor } from '@app/redux/modules/user';
import { Routes } from '@app/scenes/routes';
import * as React from 'react';
import { View } from 'react-native';
import { connect, Dispatch } from 'react-redux';

import { TeamContact } from './TeamContact';
import { TeamInfo } from './TeamInfo';
import { TeamVenue } from './TeamVenue';

interface IProps extends IStateProps, IDispatchProps {
  navigation: any;
}
class Team extends React.PureComponent<IProps> {
  public render() {
    const { team, color } = this.props;
    return (
      <Content onRefresh={this.onRefresh}>
        {team && (
          <View>
            <TeamInfo team={team} color={color} />
            <Separator group />
            {team.venue && <TeamVenue venue={team.venue} color={color} />}
            {team.venue && <Separator group />}
            {team.contact && (
              <TeamContact contacts={team.contact} color={color} />
            )}
            {team.contact && <Separator group />}
            {team.player.length > 0 && (
              <ListItem.Group>
                <ListItem.Header title={Strings.PLAYER} />
                {team.player.map((player: any, index: number) => (
                  <View key={`player-${player.id}`}>
                    <ListItem onPress={this.onOpenPlayer(player)}>
                      <ListItem.Image url={player.image} />
                      <Text>{`${player.name} ${player.surname}`}</Text>
                    </ListItem>
                    {index < team.player.length - 1 && <Separator image />}
                  </View>
                ))}
              </ListItem.Group>
            )}
          </View>
        )}
      </Content>
    );
  }

  private onRefresh = () => {
    this.props.getTeam(this.props.teamId);
  };

  private onOpenPlayer = (player: any) => () => {
    this.props.openPlayer(player);
  };
}

interface IStateProps {
  team?: any;
  color?: any;
  teamId?: string;
}

interface IDispatchProps {
  getTeam: (teamId: string) => void;
  openPlayer: (player: any) => void;
}

function mapStateToProps(state: any, props: IProps): IStateProps {
  const teamId = getNavigationStateParams(props.navigation)
    ? getNavigationStateParams(props.navigation).team.id
    : getActiveTeam(state)
      ? getActiveTeam(state).id
      : null;

  return {
    color: getColor(state),
    team: state.teams[teamId],
    teamId,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): IDispatchProps {
  return {
    getTeam: (teamId: string) => dispatch(getTeam(teamId)),
    openPlayer: (player: any) =>
      dispatch(
        navigate({
          params: player,
          routeName: Routes.playerDetails,
        }),
      ),
  };
}

export const ConnectedTeam = connect(mapStateToProps, mapDispatchToProps)(Team);
