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
import { View, ViewStyle } from 'react-native';
import { Text } from '@app/components';

import styles from './styles';

import { STATUS_FINISHED, STATUS_IN_PLAY } from '@app/redux/modules/fixtures';
import { Strings } from '@app/lib/strings';

interface Props {
  setPoints?: {
    result: {
      setPointsHomeTeam: number;
      setPointsAwayTeam: number;
    };
  };
  goals?: {
    goalsHome: number;
    goalsAway: number;
  };
  status: string;
  style?: ViewStyle;
}

export class Score extends React.PureComponent<Props> {
  public render() {
    if (this.props.setPoints) {
      return (
        <View>
          <View style={[styles.score, { marginTop: 8 }]}>
            <Text style={styles.scoreText} numberOfLines={1}>
              {`${
                this.props.setPoints.result
                  ? `${this.props.setPoints.result.setPointsHomeTeam}:${
                      this.props.setPoints.result.setPointsAwayTeam
                    }`
                  : '-:-'
              }`}
            </Text>
          </View>
          <Text
            bold
            center
            small
            style={{ marginTop: 2 }}
            numberOfLines={1}
            color={
              this.props.status === STATUS_IN_PLAY ||
              this.props.status === STATUS_FINISHED
                ? '#555'
                : 'transparent'
            }
          >
            {`${
              this.props.status === STATUS_IN_PLAY
                ? Strings.LIVE
                : Strings.UNCONFIRMED
            }`}
          </Text>
        </View>
      );
    } else if (this.props.goals) {
      return (
        <View style={{ borderWidth: 0 }}>
          <View style={[styles.score, { width: 48 }, this.props.style]}>
            <Text style={styles.scoreText} numberOfLines={1}>
              {this.props.goals
                ? `${this.props.goals.goalsHome}:${this.props.goals.goalsAway}`
                : '-:-'}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.score, { width: 48 }, this.props.style]}>
        <Text style={styles.scoreText}>-:-</Text>
      </View>
    );
  }
}
