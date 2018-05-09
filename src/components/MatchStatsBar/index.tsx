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
import { Text, View, ViewStyle } from 'react-native';

import styles from './styles';

interface IProps {
  stats: { wins: number; matches: number; draws: number; lost: number };
}
const height = 14;

export class MatchStatsBar extends React.PureComponent<IProps> {
  public render() {
    const wins: ViewStyle[] = [
      styles.wins,
      {
        flex: this.props.stats.wins / this.props.stats.matches,
        height,
      },
    ];
    const draws: ViewStyle[] = [
      styles.draws,
      {
        flex: this.props.stats.draws / this.props.stats.matches,
        height,
      },
    ];
    const lost: ViewStyle[] = [
      styles.lost,
      {
        flex: this.props.stats.lost / this.props.stats.matches,
        height,
      },
    ];

    if (this.props.stats.wins === 0) {
      draws.push({
        borderBottomLeftRadius: 8,
        borderTopLeftRadius: 8,
      });
      if (this.props.stats.draws === 0) {
        lost.push({
          borderBottomLeftRadius: 8,
          borderTopLeftRadius: 8,
        });
      }
    }

    if (this.props.stats.lost === 0) {
      draws.push({
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8,
      });
      if (this.props.stats.draws === 0) {
        wins.push({
          borderBottomRightRadius: 8,
          borderTopRightRadius: 8,
        });
      }
    }

    return (
      <View style={styles.barContainer}>
        <View style={wins}>
          {this.props.stats.wins > 0 && (
            <Text style={styles.text}>{`${this.props.stats.wins}`}</Text>
          )}
        </View>
        <View style={draws}>
          {this.props.stats.draws > 0 && (
            <Text style={styles.text}>{`${this.props.stats.draws}`}</Text>
          )}
        </View>
        <View style={lost}>
          {this.props.stats.lost > 0 && (
            <Text style={styles.text}>{`${this.props.stats.lost}`}</Text>
          )}
        </View>
      </View>
    );
  }
}
