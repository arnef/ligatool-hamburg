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

import {
  Card,
  Image,
  ListItem,
  Separator,
  TeamLogo,
  Text,
} from '@app/components';
import { ASSOC, DATETIME_DB } from '@app/config/settings';
import { Strings } from '@app/lib/strings';
import styles from '@app/scenes/app/scenes/fixture-details/styles';
import { Routes } from '@app/scenes/routes';
import { default as moment } from 'moment';
import * as React from 'react';
import { Alert, Linking, Platform, View } from 'react-native';

interface IProps {
  match: any;
  isAdmin: boolean;
  firstFixture: any;
  player: any;
  venue: any;
  color: string;
  insertResult: (fixtureId: string) => void;
  navigate: (routeName: string, params: any) => void;
}

export class NoSets extends React.PureComponent<IProps> {
  public render() {
    const { firstFixture, match, venue, color, isAdmin } = this.props;
    const date = moment(match.date, DATETIME_DB);
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.teamInfo}>
            <TeamLogo team={match.homeTeamLogo} size={90} />
          </View>
          {!firstFixture && (
            <Text small secondary bold>
              vs
            </Text>
          )}
          {firstFixture && (
            <View style={styles.firstMatch}>
              <Text small secondary bold>
                {Strings.FIRST_MATCH}
              </Text>
              <View style={styles.firstMatchResult}>
                <Text style={styles.textFirstMatchResult}>
                  {`${firstFixture.setPointsAwayTeam}:${
                    firstFixture.setPointsHomeTeam
                  }`}
                </Text>
                <Text style={styles.textFirstMatchResult}>
                  {`(${firstFixture.goalsAwayTeam}:${
                    firstFixture.goalsHomeTeam
                  }`}
                </Text>
              </View>
              <Text small secondary bold>
                {' '}
              </Text>
            </View>
          )}
          <View style={styles.teamInfo}>
            <TeamLogo team={match.awayTeamLogo} size={90} />
          </View>
        </View>
        <ListItem.Group>
          <ListItem.Header
            title={`${match.status === 'POSTPONED' ? Strings.SO_FAR : ''}`}
          />
          {venue &&
            !!venue.name && (
              <ListItem onPress={this.onOpenVenue}>
                <View style={styles.option}>
                  <Text>{`${venue.name}`}</Text>
                  <Text>{`${venue.street}, ${venue.zipCode} ${
                    venue.city
                  }`}</Text>
                </View>
                <ListItem.Icon name="pin" color={color} right />
              </ListItem>
            )}
          {isAdmin && <Separator />}
          {isAdmin &&
            ASSOC.indexOf('tfvhh') !== -1 && (
              <ListItem onPress={this.onDateChange}>
                <Text style={styles.option}>
                  {Strings.CHANGE_MATCH_DATETIME}
                </Text>
                <ListItem.Icon right color={color} name="calendar" />
              </ListItem>
            )}
          {isAdmin && ASSOC.indexOf('tfvhh') !== -1 && <Separator />}
          {isAdmin && (
            <ListItem
              onPress={this.onInsertResult}
              disabled={date.diff(moment(), 'days') > 0}
            >
              <Text style={styles.option}>{Strings.INSERT_SCORE}</Text>
              <ListItem.Icon right color={color} name="create" />
            </ListItem>
          )}
        </ListItem.Group>
        {this.renderPlayer()}
      </View>
    );
  }

  private onOpenVenue = () => {
    const { venue } = this.props;
    const uri =
      Platform.OS === 'ios'
        ? 'http://maps.apple.com/?address='
        : 'geo:53.5586526,9.6476386?q=';
    const address = encodeURI(
      `${venue.street}, ${venue.zipCode} ${venue.city}`,
    );

    Linking.openURL(uri + address).catch(() => {
      Alert.alert(Strings.MAPS_APP_NOT_FOUND);
    });
  };

  private onDateChange = () => {
    this.props.navigate(Routes.fixtureDetailsChangeDate, {
      id: this.props.match.id,
    });
  };

  private onInsertResult = () => {
    this.props.insertResult(this.props.match.id);
  };

  private onOpenPlayer = (player: any) => () => {
    this.props.navigate(Routes.playerDetails, player);
  };

  private renderPlayerCard = (player: any) => {
    return (
      <Card onPress={this.onOpenPlayer(player)}>
        <View style={styles.playerContainer}>
          <Image url={player.image} size={90} />
          <Text style={styles.playerText}>{`${player.name} ${
            player.surname
          }`}</Text>
        </View>
      </Card>
    );
  };

  private renderPlayer = () => {
    const { player } = this.props;
    const length = player.home
      ? Math.max(player.home.length, player.away.length)
      : 0;

    const childs = [];
    for (let i = 0; i < length; i++) {
      const playerHome = i < player.home.length ? player.home[i] : null;
      const playerAway = i < player.away.length ? player.away[i] : null;

      childs.push(
        <View style={styles.playerRow} key={`player-${i}`}>
          <View style={styles.player}>
            {playerHome && this.renderPlayerCard(playerHome)}
          </View>
          <View style={styles.player}>
            {playerAway && this.renderPlayerCard(playerAway)}
          </View>
        </View>,
      );
    }

    return childs;
  };
}
