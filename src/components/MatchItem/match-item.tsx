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
import { default as moment } from 'moment';
import { Card, Text, Icon, TeamLogo, Score } from '@app/components';
import { DATETIME_FORMAT, DATETIME_DB } from '@app/config/settings';
import { STATUS_POSTPONED } from '@app/redux/modules/fixtures';
import styles from './styles';

export interface MatchItemProps {
  data:
    | {
        id: string;
        date: string;
        competitionName: string;
        matchday: string;
        venueName: string;
        status: string;
        homeTeamName: string;
        homeTeamLogo: string;
        awayTeamName: string;
        awayTeamLogo: string;
      }
    | any;
  onPress?: () => void;
  color?: string;
}

export class MatchItem extends React.PureComponent<MatchItemProps> {
  public render() {
    const { data } = this.props;
    const date = moment(data.date, DATETIME_DB);
    return (
      <Card onPress={this.props.onPress}>
        <View style={styles.container}>
          <Text bold color={this.props.color}>
            {`${data.competitionName} (${data.matchday})`}
          </Text>
          <Text secondary small>
            {!!data.venueName && <Icon name={'pin'} />}
            {data.venueName ? ` ${data.venueName}  ` : ''}
            <Icon name={'clock'} />{' '}
            {`${data.status === STATUS_POSTPONED ? 'bisher ' : ''}${date.format(
              DATETIME_FORMAT,
            )}`}
          </Text>
          {__DEV__ && <Text>{`${data.status}`}</Text>}
          <View style={styles.teams}>
            <View style={styles.team}>
              <TeamLogo team={data.homeTeamLogo} big />
              <View style={styles.teamName}>
                <Text small center numberOfLines={2}>
                  {data.homeTeamName}
                </Text>
              </View>
            </View>
            <View style={styles.score}>
              <Score setPoints={data} status={data.status} />
            </View>
            <View style={styles.team}>
              <TeamLogo team={data.awayTeamLogo} big />
              <View style={styles.teamName}>
                <Text small center numberOfLines={2}>
                  {data.awayTeamName}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    );
  }
}
