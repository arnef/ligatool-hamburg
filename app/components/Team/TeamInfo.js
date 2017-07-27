// @flow
import React from 'react';
import { View } from 'react-native';
import { ListItem, Image, Text, Separator } from '../../components';

import styles from './styles';

const weekdays = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
];

export default function TeamInfo(props): ReactElement<any> {
  return (
    <ListItem.Group>
      {!!props.team.image &&
        <View style={styles.teamLogo}>
          <Image url={props.team.image} size={240} />
        </View>}
      <ListItem multiline>
        <View>
          <Text bold>Name</Text>
          <Text>{`${props.team.name}`}</Text>
        </View>
      </ListItem>
      <ListItem multiline>
        <View>
          <Text bold>Gruppe</Text>
          <Text>{`${props.team.league.name} - ${props.team
            .position}. Platz`}</Text>
        </View>
      </ListItem>
      <Separator />
      <ListItem multiline>
        <View>
          <Text bold>Verein</Text>
          <Text>{`${props.team.club.name}`}</Text>
        </View>
      </ListItem>
      <Separator />
      <ListItem multiline>
        <View>
          <Text bold>Heimtisch</Text>
          <Text>
            {props.team.table}
          </Text>
        </View>
      </ListItem>
      <Separator />
      <ListItem multiline>
        <View>
          <Text bold>Heimspielzeit</Text>
          <Text>{`${!isNaN(parseInt(props.team.home_match_day, 10))
            ? `${weekdays[props.team.home_match_day]} ${props.team
                .home_match_time
                ? `um ${props.team.home_match_time}`
                : ''}`
            : '-'}`}</Text>
        </View>
      </ListItem>
    </ListItem.Group>
  );
}
