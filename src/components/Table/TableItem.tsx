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
import { ListItem, Text, TeamLogo, MatchStatsBar } from '@app/components';

import styles from './styles';

interface Props {
  details: boolean;
  data: any;
  onPress: (data: any) => void;
}

export class TableItem extends React.PureComponent<Props> {
  private onPress = (data: any) => () => {
    this.props.onPress(data);
  };

  public render() {
    return (
      <ListItem onPress={this.onPress(this.props.data)}>
        <Text style={styles.position}>{`${this.props.data.rank}`}</Text>
        <View style={styles.teamLogo}>
          <TeamLogo team={this.props.data.teamEmblemUrl} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Text style={styles.teamName} numberOfLines={1}>
              {this.props.data.teamName}
            </Text>
            {this.props.details && (
              <Text style={styles.matches}>{`${
                this.props.data.playedGames
              }`}</Text>
            )}
            {this.props.details && (
              <Text style={styles.setPoints}>
                {`${this.props.data.setPointsDifference}`}
              </Text>
            )}
            {this.props.details && (
              <Text style={styles.goals}>{`${
                this.props.data.goalsDifference
              }`}</Text>
            )}
            {this.props.details && (
              <Text style={styles.points}>{`${this.props.data.points}`}</Text>
            )}
          </View>
          {this.props.details && (
            <View style={styles.row}>
              <MatchStatsBar
                stats={{
                  wins: this.props.data.overallWin,
                  lost: this.props.data.overallLost,
                  draws: this.props.data.overallDraw,
                  matches: this.props.data.playedGames,
                }}
              />
            </View>
          )}
        </View>
      </ListItem>
    );
  }
}
