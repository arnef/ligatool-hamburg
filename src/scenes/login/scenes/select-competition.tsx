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
import { sortCompetition } from '@app/helper';
import { getLeagues } from '@app/redux/modules/leagues';
import { navigate } from '@app/redux/modules/navigation';
import { Routes } from '@app/scenes/routes';
import { sortBy } from 'lodash';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

interface IProps extends IIStateProps, IIDispatchProps {}

class SelectCompetitionScene extends React.PureComponent<IProps> {
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

  private onSelectCompetition = (item: any) => () => {
    this.props.navigate({
      params: { id: item.id },
      routeName: Routes.selectTeam,
    });
  };

  private renderItem = ({ item }: any): React.ReactElement<any> => {
    return (
      <ListItem onPress={this.onSelectCompetition(item)}>
        <Text>{`${item.name}`}</Text>
      </ListItem>
    );
  };
}

interface IIStateProps {
  leagues: any[];
}
interface IIDispatchProps {
  getRankings: () => void;
  navigate: (route: any) => void;
}

function mapStateToProps(state: any): IIStateProps {
  return {
    leagues: sortBy(state.drawer, sortCompetition),
  };
}
function mapDispatchToProps(dispatch: Dispatch<any>): IIDispatchProps {
  return {
    getRankings: () => dispatch(getLeagues()),
    navigate: (route: any) => dispatch(navigate(route)),
  };
}

export const SelectCompetition = connect(mapStateToProps, mapDispatchToProps)(
  SelectCompetitionScene,
);
