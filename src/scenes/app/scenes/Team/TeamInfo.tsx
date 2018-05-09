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

import { Image, ListItem, Separator, Text } from '@app/components';
import { Strings } from '@app/lib/strings';
import * as React from 'react';
import { View } from 'react-native';

import styles from './styles';

interface IProps {
  color: string;
  team: any;
}
export class TeamInfo extends React.PureComponent<IProps> {
  public render() {
    return (
      <ListItem.Group>
        {!!this.props.team.emblemUrl && (
          <View style={styles.teamLogo}>
            <Image url={this.props.team.emblemUrl} size={240} />
          </View>
        )}
        <ListItem multiline>
          <View>
            <Text bold>{Strings.NAME}</Text>
            <Text>{`${this.props.team.name}`}</Text>
          </View>
        </ListItem>
        <Separator />
        {this.props.team.standing && (
          <View>
            <ListItem multiline>
              <View>
                <Text bold>{Strings.GROUP}</Text>
                <Text>{`${this.props.team.standing.competitionName} - ${
                  this.props.team.standing.rank
                }${Strings.DOT_POSITION}`}</Text>
              </View>
            </ListItem>
            <Separator />
          </View>
        )}
        <ListItem multiline>
          <View>
            <Text bold>{Strings.CLUB} </Text>
            <Text>{`${this.props.team.club.name}`}</Text>
          </View>
        </ListItem>
        <Separator />
        <ListItem multiline>
          <View>
            <Text bold>{Strings.HOME_TABLE}</Text>
            <Text>{this.props.team.homeFixture.table}</Text>
          </View>
        </ListItem>
        <Separator />
        <ListItem multiline>
          <View>
            <Text bold>{Strings.HOME_MATCH_TIME}</Text>
            <Text>{`${
              !isNaN(parseInt(this.props.team.homeFixture.day, 10))
                ? `${Strings.WEEKDAYS[this.props.team.homeFixture.day]} ${
                    this.props.team.homeFixture.time
                      ? `${Strings.TIME_AT} ${this.props.team.homeFixture.time}`
                      : ''
                  }`
                : '-'
            }`}</Text>
          </View>
        </ListItem>
      </ListItem.Group>
    );
  }
}
