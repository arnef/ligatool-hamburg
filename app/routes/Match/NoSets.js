import React from 'react';
import { View, Linking, Alert, Platform } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Text,
  TeamLogo,
  Card,
  ListItem,
  Image,
  Separator,
} from '../../components';
import S from '../../lib/strings';
import styles from './styles';
import * as MatchesActions from '../../redux/modules/matches';
import * as NavigationActions from '../../redux/modules/navigation';
import Routes from '../../config/routes';
import { DATETIME_DB, DATETIME_FORMAT } from '../../config/settings';
import { setFixtureStatusInPlay } from '../../redux/modules/fixtures';

function NoSets(props) {
  function onOpenVenue() {
    const address = `${props.venue.street}, ${props.venue.zipCode} ${props.venue
      .city}`;
    const uri =
      Platform.OS === 'ios'
        ? 'http://maps.apple.com/?address='
        : 'geo:53.5586526,9.6476386?q=';

    Linking.openURL(uri + encodeURI(address)).catch(() =>
      Alert.alert(S.MAPS_APP_NOT_FOUND),
    );
  }

  function insertResult() {
    props.insertResult(props.match.id);
  }

  function openDateChange() {
    props.navigate(Routes.MATCH_DATE, { id: props.match.id });
  }

  function renderPlayer() {
    const { player } = props;
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
            {playerHome &&
              <Card
                onPress={() => {
                  props.navigate(Routes.PLAYER, playerHome);
                }}
              >
                <View style={styles.playerContainer}>
                  <Image url={playerHome.image} size={90} />
                  <Text
                    style={styles.playerText}
                  >{`${playerHome.name} ${playerHome.surname}`}</Text>
                </View>
              </Card>}
          </View>
          <View style={styles.player}>
            {playerAway &&
              <Card
                onPress={() => {
                  props.navigate(Routes.PLAYER, playerAway);
                }}
              >
                <View style={styles.playerContainer}>
                  <Image url={playerAway.image} size={90} />
                  <Text
                    style={styles.playerText}
                  >{`${playerAway.name} ${playerAway.surname}`}</Text>
                </View>
              </Card>}
          </View>
        </View>,
      );
    }
    return childs;
  }

  const date = moment(props.match.date, DATETIME_DB);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.teamInfo}>
          <TeamLogo team={props.match.homeTeamLogo} size={90} />
        </View>
        {!props.firstFixture &&
          <Text style={styles.teamVs} bold secondary>
            vs
          </Text>}
        {props.firstFixture &&
          <View style={styles.firstMatch}>
            <Text small secondary bold>
              {S.FIRST_MATCH}
            </Text>
            <View style={styles.firstMatchResult}>
              <Text style={styles.textFirstMatchResult}>
                {`${props.firstFixture.setPointsAwayTeam}:${props.firstFixture
                  .setPointsHomeTeam}`}
              </Text>
              <Text style={styles.textFirstMatchResult}>
                {`(${props.firstFixture.goalsAwayTeam}:${props.firstFixture
                  .goalsHomeTeam})`}
              </Text>
            </View>
            <Text small secondary bold>
              {' '}
            </Text>
          </View>}
        <View style={styles.teamInfo}>
          <TeamLogo team={props.match.awayTeamLogo} size={90} />
        </View>
      </View>

      <ListItem.Group>
        <ListItem.Header
          title={`${props.match.status == 'POSTPONED'
            ? S.SO_FAR
            : ''}${date.format(DATETIME_FORMAT)}`}
        />
        {props.venue &&
          <ListItem onPress={onOpenVenue}>
            <View style={styles.option}>
              <Text>{`${props.venue.name}`}</Text>
              <Text>{`${props.venue.street}, ${props.venue.zipCode} ${props
                .venue.city}`}</Text>
            </View>
            <ListItem.Icon right color={props.color} name="pin" />
          </ListItem>}
        {props.isAdmin && <Separator />}
        {props.isAdmin &&
          <ListItem onPress={openDateChange}>
            <Text style={styles.option}>
              {S.CHANGE_MATCH_DATETIME}
            </Text>
            <ListItem.Icon right color={props.color} name="calendar" />
          </ListItem>}
        {props.isAdmin && <Separator />}
        {props.isAdmin &&
          <ListItem
            onPress={insertResult}
            disabled={date.diff(moment(), 'days') > 0}
          >
            <Text style={styles.option}>
              {S.INSERT_SCORE}
            </Text>
            <ListItem.Icon right color={props.color} name="create" />
          </ListItem>}
      </ListItem.Group>
      {renderPlayer()}
    </View>
  );
}

export default connect(
  state => ({
    color: state.settings.color,
  }),
  (dispatch, props) => ({
    insertResult: () => dispatch(setFixtureStatusInPlay(props.match.id)),
    navigate: (routeName, params) =>
      dispatch(NavigationActions.navigate({ routeName, params })),
  }),
)(NoSets);
