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

import { Content, ListItem, Separator, TeamLogo, Text } from '@app/components';
import { getNavigationStateParams } from '@app/redux/modules/navigation';
import { sortBy } from 'lodash';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

interface IProps extends IIStateProps, IIDispatchProps {}

class SelectTeamScene extends React.PureComponent<IProps> {
  public render() {
    return (
      <Content
        renderItem={this.renderItem}
        renderSeparator={this.renderSeparator}
        data={this.props.teams}
      />
    );
  }

  private onSelectTeam = (team: any) => () => {
    this.props.setUserTeam(team);
  };

  private renderItem = ({ item }: any) => {
    return (
      <ListItem onPress={this.onSelectTeam(item)}>
        <TeamLogo team={item.emblemUrl} />
        <Text>{`${item.name}`}</Text>
      </ListItem>
    );
  };

  private renderSeparator = () => {
    return <Separator image />;
  };
}

interface IIStateProps {
  teams: any[];
}
interface IIDispatchProps {
  setUserTeam: (team: any) => void;
}

function mapStateToProps(state: any, props: any): IIStateProps {
  return {
    teams: sortBy(
      state.drawer[getNavigationStateParams(props.navigation).id]
        ? state.drawer[getNavigationStateParams(props.navigation).id].teams
        : [],
      'name',
    ),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): IIDispatchProps {
  return {
    setUserTeam: (team: any) =>
      dispatch({ type: 'SELECT_USER_TEAM', payload: { id: team.id } }),
  };
}

export const SelectTeam = connect(mapStateToProps, mapDispatchToProps)(
  SelectTeamScene,
);
