// @flow
import React from 'react';
import { View, Linking, Platform, Alert } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Card,
  Text,
  Icon,
  TeamLogo,
  Score,
  ActionSheet,
} from '../../components';
import { DATETIME_FORMAT } from '../../config/settings';
import Routes from '../../config/routes';
import * as NavigationActions from '../../redux/modules/navigation';
import styles from './styles';
import S from '../../lib/strings';

type MatchItemProps = {
  data: Match,
  color: string,
  dispatch: Function,
};

function MatchItem(props: MatchItemProps): ReactElement<any> {
  const date = moment(props.data.datetime, 'YYYY-MM-DD HH:mm:ss');
  return (
    <Card
      onPress={() => {
        // if (props.data.set_points) {
        props.dispatch(
          NavigationActions.navigate({
            routeName: Routes.MATCH,
            params: { id: props.data.id, title: props.data.league.name },
          }),
        );
        // } else {
        //   const options = [
        //     'Spielort anzeigen',
        //     `${props.data.team_home.name} anzeigen`,
        //     `${props.data.team_away.name} anzeigen`,
        //   ];
        //   if (props.data.is_admin) {
        //     options.push('Ergebnis eintragen');
        //   }
        //   ActionSheet.show({ options }, index => {
        //     if (index === 0) {
        //       const address = `${props.data.venue.street}, ${props.data.venue
        //         .zip_code} ${props.data.venue.city}`;
        //       const uri =
        //         Platform.OS === 'ios'
        //           ? 'http://maps.apple.com/?address='
        //           : 'geo:53.5586526,9.6476386?q=';

        //       Linking.openURL(uri + encodeURI(address)).catch(() =>
        //         Alert.alert(S.MAPS_APP_NOT_FOUND),
        //       );
        //     } else if (index === 1) {
        //       props.dispatch(
        //         NavigationActions.navigate({
        //           routeName: Routes.TEAM,
        //           params: {
        //             team: props.data.team_home,
        //             title: props.data.team_home.name,
        //           },
        //         }),
        //       );
        //     } else if (index === 2) {
        //       props.dispatch(
        //         NavigationActions.navigate({
        //           routeName: Routes.TEAM,
        //           params: {
        //             team: props.data.team_away,
        //             title: props.data.team_away.name,
        //           },
        //         }),
        //       );
        //     } else if (index === 3) {
        //       props.dispatch(
        //         NavigationActions.navigate({
        //           routeName: Routes.MATCH,
        //           params: { id: props.data.id, title: props.data.league.name },
        //         }),
        //       );
        //     }
        //   });
        // }
      }}
    >
      <View style={styles.container}>
        <Text bold color={props.color}>
          {`${props.data.league.name} (${props.data.match_day})`}
        </Text>
        {props.data.venue &&
          <Text secondary small>
            <Icon name={'pin'} />
            {` ${props.data.venue.name} ${date.format(DATETIME_FORMAT)}`}
          </Text>}
        <View style={styles.teams}>
          <View style={styles.team}>
            <TeamLogo team={props.data.team_home} big />
            <View style={styles.teamName}>
              <Text small center numberOfLines={2}>
                {props.data.team_home.name}
              </Text>
            </View>
          </View>
          <View style={styles.score}>
            <Score setPoints={props.data} />
          </View>
          <View style={styles.team}>
            <TeamLogo team={props.data.team_away} big />
            <View style={styles.teamName}>
              <Text small center numberOfLines={2}>
                {props.data.team_away.name}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
}

export default connect(state => ({ color: state.settings.color }))(MatchItem);
