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
import { View } from 'react-native';
import { connect, Dispatch } from 'react-redux';
import { StaticListHeader, Text, Separator, Content } from '@app/components';
import { getLeague } from '@app/redux/modules/leagues';
import {
  getNavigationStateParams,
  navigate,
} from '@app/redux/modules/navigation';
import { Routes } from '@app/scenes/routes';
import { Strings } from '@app/lib/strings';

import { TableItem } from './TableItem';
import styles from './styles';

interface Props extends StateProps, DispatchProps {
  navigation: any;
}

class Table extends React.PureComponent<Props> {
  private onPress = (team: any) => () => {
    this.props.openTeam(team);
  };

  private renderItem = ({ item }: any): React.ReactElement<any> => {
    return (
      <TableItem
        details={this.props.showDetails}
        data={item}
        onPress={this.onPress(item)}
      />
    );
  };

  private renderSeparator = () => {
    return <Separator table image />;
  };

  public render() {
    return (
      <View style={styles.container}>
        {this.props.showDetails && (
          <StaticListHeader>
            <View style={styles.header}>
              <Text style={styles.position} />
              <View style={styles.teamLogo} />
              <View style={styles.teamName} />
              <Text small color="#fff" style={styles.matches} numberOfLines={1}>
                {Strings.GAMES_SHORT}
              </Text>
              <Text
                small
                color="#fff"
                style={styles.setPoints}
                numberOfLines={1}
              >
                {Strings.SETS}
              </Text>
              <Text small color="#fff" style={styles.goals} numberOfLines={1}>
                {/* TODO: check dynamic {S.GOALS} */}
                {Strings.GAMES}
              </Text>
              <Text small color="#fff" style={styles.points} numberOfLines={1}>
                {Strings.POINTS_SHORT}
              </Text>
            </View>
          </StaticListHeader>
        )}
        <Content
          onRefresh={this.props.getTable}
          renderItem={this.renderItem}
          renderSeparator={this.renderSeparator}
          listEmptyText={Strings.NO_STANDING}
          data={this.props.table}
        />
      </View>
    );
  }
}

interface StateProps {
  table: Array<any>;
  showDetails: boolean;
}
interface DispatchProps {
  getTable: () => void;
  openTeam: (team: any) => void;
}

function mapStateToProps(state: any, props: Props): StateProps {
  const lid = getNavigationStateParams(props.navigation).id;
  const league = state.leagues[lid];
  return {
    table: league ? league.table : null,
    showDetails: league ? league.standing > 0 : false,
  };
}
function mapDispatchToProps(
  dispatch: Dispatch<any>,
  props: Props,
): DispatchProps {
  return {
    getTable: () =>
      dispatch(getLeague(getNavigationStateParams(props.navigation).id)),
    openTeam: (team: any) =>
      dispatch(
        navigate({
          routeName: Routes.teamDetails,
          params: {
            team: { id: team.teamId, groupId: team.groupId },
            title: team.teamName,
          },
        }),
      ),
  };
}

export const ConnectedTable = connect(mapStateToProps, mapDispatchToProps)(
  Table,
);
