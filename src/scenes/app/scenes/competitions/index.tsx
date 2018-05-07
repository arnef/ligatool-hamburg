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
import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import { Content, ListItem, Text, Separator } from '@app/components';
import { sortCompetition } from '@app/helper';
import { getLeagues } from '@app/redux/modules/leagues';
import { navigate as navigationAction } from '@app/redux/modules/navigation';
import { Routes } from '@app/scenes/routes';

interface Props {
  navigate: Function;
  leagues: Array<any>;
  getLeagues: Function;
}
class LeaguesList extends React.PureComponent<Props> {
  private onOpenCompetition = (competition: any) => () => {
    this.props.navigate(
      competition.standing ? Routes.competition : Routes.cup,
      { title: competition.name, id: competition.id },
    );
  };

  private renderItem = ({ item }: any) => {
    return (
      <ListItem onPress={this.onOpenCompetition(item)}>
        <Text>{`${item.name}`}</Text>
      </ListItem>
    );
  };

  public render() {
    const { leagues, getLeagues } = this.props;
    return (
      <Content
        onRefresh={getLeagues}
        renderItem={this.renderItem}
        renderSeparator={Separator}
        data={leagues}
      />
    );
  }
}

export const Competitions = connect(
  state => ({
    leagues: sortBy(state.drawer, sortCompetition),
  }),
  dispatch => ({
    getLeagues: () => dispatch(getLeagues()),
    navigate: (routeName: string, params: any) =>
      dispatch(navigationAction({ routeName, params })),
  }),
)(LeaguesList);
