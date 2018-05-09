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

import { Text, Touchable } from '@app/components';
import * as React from 'react';
import { View } from 'react-native';

import styles from './styles';

export interface IMatchHeaderProps {
  home: string;
  away: string;
  result?: {
    setPointsHomeTeam: number;
    setPointsAwayTeam: number;
    goalsHomeTeam: number;
    goalsAwayTeam: number;
  };
  color?: string;
  onPress: (team: string) => void;
}

export class MatchHeader extends React.PureComponent<IMatchHeaderProps> {
  public render() {
    return (
      <View style={[styles.container, { backgroundColor: this.props.color }]}>
        <Touchable
          light
          style={styles.containerTeam}
          onPress={this.onPress('home')}
        >
          <Text style={styles.textTeam} numberOfLines={2}>
            {`${this.props.home}`}
          </Text>
        </Touchable>
        <View style={styles.containerScore}>
          <Text style={styles.textScore}>
            {`${
              this.props.result
                ? `${this.props.result.setPointsHomeTeam}:${
                    this.props.result.setPointsAwayTeam
                  }`
                : '-:-'
            }`}
          </Text>
          <Text small style={styles.textScore}>
            {`(${
              this.props.result
                ? `${this.props.result.goalsHomeTeam}:${
                    this.props.result.goalsAwayTeam
                  }`
                : '-:-'
            })`}
          </Text>
        </View>
        <Touchable
          light
          style={styles.containerTeam}
          onPress={this.onPress('away')}
        >
          <Text style={styles.textTeam} numberOfLines={2}>
            {`${this.props.away}`}
          </Text>
        </Touchable>
      </View>
    );
  }

  private onPress = (team: string) => () => {
    this.props.onPress(team);
  };
}
