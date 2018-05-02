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
import { Content, Separator, ListItem, Text } from '../../../components';
import { Routes } from 'src/scenes/routes';
import { connect, Dispatch } from 'react-redux';
import { sortBy } from 'lodash';
import { sortCompetition } from 'src/Helper';
import { getLeagues } from '../../../redux/modules/leagues';
import { navigate } from '../../../redux/modules/navigation';

interface Props extends StateProps, DispatchProps {}

class SelectCompetitionScene extends React.PureComponent<Props> {

  private onSelectCompetition = (item: any) => () => {
    this.props.navigate({
      routeName: Routes.selectTeam,
      params: { id: item. id }
    });
  }

  private renderItem = ({ item }: any) => {
    return (
      <ListItem onPress={this.onSelectCompetition(item)}>
        <Text>{`${item.name}`}</Text>
      </ListItem>
    )
  }

  public render() {
    return (
      <Content
        onRefresh={this.props.getRankings}
        renderItem={this.renderItem}
        renderSeparator={Separator}
        data={this.props.leagues}
      />
    );
  }
}

interface StateProps {
  leagues: Array<any>
}
interface DispatchProps {
  getRankings: Function
  navigate: Function
}

function mapStateToProps(state: any): StateProps {
  return {
    leagues: sortBy(state.drawer, sortCompetition),
  }
}
function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    getRankings: () => dispatch(getLeagues()),
    navigate: (route: any) => dispatch(navigate(route)),
  }
}

export const SelectCompetition = connect(mapStateToProps, mapDispatchToProps)(SelectCompetitionScene);