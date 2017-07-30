// @flow
import React from 'react';
import { View, Linking, Alert, Platform } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Text,
  TeamLogo,
  Card,
  Button,
  Icon,
  ListItem,
  Image,
  Separator,
  Score,
} from '../../components';
import S from '../../lib/strings';
import styles from './styles';
import * as MatchesActions from '../../redux/modules/matches';
import * as NavigationActions from '../../redux/modules/navigation';
import Routes from '../../config/routes';
import { DATETIME_DB, DATETIME_FORMAT } from '../../config/settings';
type NoSetsProps = {
  match: Match,
};

function NoSets(props: NoSetsProps): ReactElement<any> {
  function onOpenVenue() {
    const address = `${props.match.venue.street}, ${props.match.venue
      .zip_code} ${props.match.venue.city}`;
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
    const length = props.match.team_home.player
      ? Math.max(
          props.match.team_home.player.length,
          props.match.team_away.player.length,
        )
      : 0;
    const childs = [];
    for (let i = 0; i < length; i++) {
      const playerHome =
        i < props.match.team_home.player.length
          ? props.match.team_home.player[i]
          : null;
      const playerAway =
        i < props.match.team_away.player.length
          ? props.match.team_away.player[i]
          : null;
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

  const date = moment(props.match.datetime, DATETIME_DB);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.teamInfo}>
          <TeamLogo team={props.match.team_home} size={90} />
        </View>
        {!props.match.first_match &&
          <Text style={styles.teamVs} bold secondary>
            vs
          </Text>}
        {props.match.first_match &&
          <View style={styles.firstMatch}>
            <Text small secondary bold>
              {S.FIRST_MATCH}
            </Text>
            <View style={styles.firstMatchResult}>
              <Text style={styles.textFirstMatchResult}>
                {`${props.match.first_match.set_points.away}:${props.match
                  .first_match.set_points.home}`}
              </Text>
              <Text style={styles.textFirstMatchResult}>
                {`(${props.match.first_match.goals.away}:${props.match
                  .first_match.goals.home})`}
              </Text>
            </View>
            <Text small secondary bold>
              {' '}
            </Text>
          </View>}
        <View style={styles.teamInfo}>
          <TeamLogo team={props.match.team_away} size={90} />
        </View>
      </View>

      <ListItem.Group>
        <ListItem.Header
          title={`${props.match.date_confirmed ? '' : S.SO_FAR}${date.format(
            DATETIME_FORMAT,
          )}`}
        />
        <ListItem onPress={onOpenVenue}>
          <Text style={styles.option}>
            {S.OPEN_VENUE}
          </Text>
          <ListItem.Icon right color={props.color} name="pin" />
        </ListItem>
        {props.match.is_admin && <Separator />}
        {props.match.is_admin &&
          <ListItem onPress={openDateChange}>
            <Text style={styles.option}>
              {S.CHANGE_MATCH_DATETIME}
            </Text>
            <ListItem.Icon right color={props.color} name="calendar" />
          </ListItem>}
        {props.match.is_admin && <Separator />}
        {props.match.is_admin &&
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
  (dispatch: Dispatch<any>) => ({
    insertResult: (id: string) => dispatch(MatchesActions.insertResults(id)),
    navigate: (routeName, params) =>
      dispatch(NavigationActions.navigate({ routeName, params })),
  }),
)(NoSets);
