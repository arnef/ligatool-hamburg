// @flow
import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { Card, Text, Icon, TeamLogo, Score } from '../../components';
import { DATETIME_FORMAT } from '../../config/settings';
import Routes from '../../config/routes';
import * as NavigationActions from '../../redux/modules/navigation';
import styles from './styles';

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
        props.dispatch(
          NavigationActions.navigate({
            routeName: Routes.MATCH,
            params: { id: props.data.id, title: props.data.league.name },
          }),
        );
      }}
    >
      <View style={styles.container}>
        <Text bold color={props.color}>
          {`${props.data.league.name} (${props.data.match_day})`}
        </Text>
        {props.data.venue &&
          <Text secondary small>
            <Icon name={'pin'} />
            {` ${props.data.venue.name}  `}
            <Icon name={'clock'} />{' '}
            {`${props.data.date_confirmed ? '' : 'bisher '}${date.format(
              DATETIME_FORMAT,
            )}`}
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
