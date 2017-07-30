// @flow
import { Image, ListItem, Separator, Text } from '../../components';

import React from 'react';
import S from '../../lib/strings';
import { View } from 'react-native';
import styles from './styles';

export default function TeamInfo(props): ReactElement<any> {
  return (
    <ListItem.Group>
      {!!props.team.image &&
        <View style={styles.teamLogo}>
          <Image url={props.team.image} size={240} />
        </View>}
      <ListItem multiline>
        <View>
          <Text bold>
            {S.NAME}
          </Text>
          <Text>{`${props.team.name}`}</Text>
        </View>
      </ListItem>
      <ListItem multiline>
        <View>
          <Text bold>
            {S.GROUP}
          </Text>
          <Text>{`${props.team.league.name} - ${props.team
            .position}${S.DOT_POSITION}`}</Text>
        </View>
      </ListItem>
      <Separator />
      <ListItem multiline>
        <View>
          <Text bold>
            {S.CLUB}{' '}
          </Text>
          <Text>{`${props.team.club.name}`}</Text>
        </View>
      </ListItem>
      <Separator />
      <ListItem multiline>
        <View>
          <Text bold>
            {S.HOME_TABLE}
          </Text>
          <Text>
            {props.team.table}
          </Text>
        </View>
      </ListItem>
      <Separator />
      <ListItem multiline>
        <View>
          <Text bold>
            {S.HOME_MATCH_TIME}
          </Text>
          <Text>{`${!isNaN(parseInt(props.team.home_match_day, 10))
            ? `${S.WEEKDAYS[props.team.home_match_day]} ${props.team
                .home_match_time
                ? `${S.TIME_AT} ${props.team.home_match_time}`
                : ''}`
            : '-'}`}</Text>
        </View>
      </ListItem>
    </ListItem.Group>
  );
}
