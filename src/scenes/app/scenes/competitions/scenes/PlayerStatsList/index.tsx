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

import { Content, Separator, StaticListHeader, Text } from '@app/components';
import { Strings } from '@app/lib/strings';
import { queryPlayerStats } from '@app/redux/actions';
import {
  getNavigationStateParams,
  navigate,
} from '@app/redux/modules/navigation';
import { Routes } from '@app/scenes/routes';
import * as React from 'react';
import { View } from 'react-native';
import { connect, Dispatch } from 'react-redux';

import { Player } from './components/Player';
import styles from './styles';

interface IProps extends IStateProps, IDispatchProps {
  navigation: any;
}

class PlayerStatsList extends React.PureComponent<IProps> {
  public render() {
    const { stats } = this.props;
    return (
      <View style={styles.container}>
        {stats &&
          stats.length > 0 && (
            <StaticListHeader>
              <View style={styles.header}>
                <View style={styles.position} />
                <View style={styles.playerImage} />
                <Text
                  small
                  color="#fff"
                  style={styles.playerName}
                  numberOfLines={1}
                >
                  {Strings.NAME}
                </Text>
                <Text small color="#fff" style={styles.rate} numberOfLines={1}>
                  {Strings.RATE_SHORT}
                </Text>
                <Text
                  small
                  color="#fff"
                  style={styles.matches}
                  numberOfLines={1}
                >
                  {Strings.GAMES}
                </Text>
                {!!stats[0].competitiveIndex && (
                  <Text
                    small
                    color="#fff"
                    style={styles.competitiveIndex}
                    numberOfLines={1}
                  >
                    {Strings.COMPETITIVE_INDEX_SHORT}
                  </Text>
                )}
                {!stats[0].competitiveIndex && (
                  <Text
                    small
                    color="#fff"
                    style={styles.competitiveIndex}
                    numberOfLines={1}
                  >
                    {Strings.GAME_POINTS_POSITIV}
                  </Text>
                )}
              </View>
            </StaticListHeader>
          )}
        <Content
          onRefresh={this.props.queryPlayerStats}
          renderItem={this.renderItem}
          renderSeparator={this.renderSeparator}
          listEmptyText={Strings.NO_PLAYER_STATS}
          data={stats}
        />
      </View>
    );
  }

  private renderItem = ({ item }: any): React.ReactElement<any> => {
    return <Player {...item} onPress={this.props.openPlayer} />;
  };

  private renderSeparator = () => {
    return <Separator table image />;
  };
}

interface IStateProps {
  stats: any[];
}
interface IDispatchProps {
  queryPlayerStats: () => void;
  openPlayer: (player: any) => void;
}

function mapStateToProps(state: any, props: IProps): IStateProps {
  const id = getNavigationStateParams(props.navigation).id;
  return {
    stats:
      state.leagues[id] && state.leagues[id].players
        ? state.leagues[id].players
        : null,
  };
}

function mapDispatchToProps(
  dispatch: Dispatch<any>,
  props: IProps,
): IDispatchProps {
  const id = getNavigationStateParams(props.navigation);
  return {
    openPlayer: (player: any) =>
      dispatch(navigate({ routeName: Routes.playerDetails, params: player })),
    queryPlayerStats: () => dispatch(queryPlayerStats(id)),
  };
}

export const ConnectedPlayerStatsList = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayerStatsList);
