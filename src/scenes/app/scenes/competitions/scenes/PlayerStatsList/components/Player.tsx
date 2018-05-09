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

import { Image, ListItem, MatchStatsBar, Text } from '@app/components';
import * as React from 'react';
import { View } from 'react-native';

import styles from '../styles';

interface IProps {
  player: any;
  overallWin: number;
  overallLost: number;
  overallDraw: number;
  rank: number;
  rate: string;
  competitiveIndex?: string;
  pointsWin?: number;
  onPress?: (player: any) => void;
}

export class Player extends React.PureComponent<IProps> {
  public render() {
    return (
      <ListItem onPress={this.onPress(this.props.player)}>
        <View style={styles.position}>
          <Text>{`${this.props.rank}`}</Text>
        </View>
        <Image
          url={this.props.player.image}
          size={32}
          style={styles.playerImage}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Text numberOfLines={1} style={styles.playerName}>
              {`${this.props.player.name} ${this.props.player.surname}`}
            </Text>
            <Text style={styles.rate}>{`${this.props.rate}`}</Text>
            <Text style={styles.matches}>{`${this.props.overallWin +
              this.props.overallLost +
              this.props.overallDraw}`}</Text>
            {!!this.props.competitiveIndex && (
              <Text style={styles.competitiveIndex}>{`${
                this.props.competitiveIndex.split('.')[0]
              }`}</Text>
            )}
            {!this.props.competitiveIndex && (
              <Text style={styles.competitiveIndex}>{`${
                this.props.pointsWin
              }`}</Text>
            )}
          </View>
          <View style={styles.row}>
            <MatchStatsBar
              stats={{
                draws: this.props.overallDraw,
                lost: this.props.overallLost,
                matches:
                  this.props.overallWin +
                  this.props.overallLost +
                  this.props.overallDraw,
                wins: this.props.overallWin,
              }}
            />
          </View>
        </View>
      </ListItem>
    );
  }

  private onPress = (player: any) => () => {
    if (this.props.onPress) {
      this.props.onPress(player);
    }
  };
}
