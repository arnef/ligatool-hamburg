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
import { connect } from 'react-redux';
import { Text, Touchable } from '@app/components';
import { getColor } from '@app/redux/modules/user';
import styles from './styles';

interface Props extends StateProps {
  home: string;
  away: string;
  result?: {
    setPointsHomeTeam: number;
    setPointsAwayTeam: number;
    goalsHomeTeam: number;
    goalsAwayTeam: number;
  };
  onPress: (team: string) => void;
}
class MatchHeader extends React.PureComponent<Props> {
  private onPress = (team: string) => () => {
    this.props.onPress(team);
  };

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
}

interface StateProps {
  color: string;
}

function mapStateToProps(state: any): StateProps {
  return {
    color: getColor(state),
  };
}

export const ConnectedMatchHeader = connect(mapStateToProps)(MatchHeader);
