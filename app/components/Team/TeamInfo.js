import { Image, ListItem, Separator, Text } from '../../components';

import React from 'react';
import S from '../../lib/strings';
import { View } from 'react-native';
import styles from './styles';

export default function TeamInfo(props) {
  return (
    <ListItem.Group>
      {!!props.team.emblemUrl &&
        <View style={styles.teamLogo}>
          <Image url={props.team.emblemUrl} size={240} />
        </View>}
      <ListItem multiline>
        <View>
          <Text bold>
            {S.NAME}
          </Text>
          <Text>{`${props.team.name}`}</Text>
        </View>
      </ListItem>
      {props.team.standing &&
        <View>
          <ListItem multiline>
            <View>
              <Text bold>
                {S.GROUP}
              </Text>
              <Text>{`${props.team.standing.competitionName} - ${props.team
                .standing.rank}${S.DOT_POSITION}`}</Text>
            </View>
          </ListItem>
          <Separator />
        </View>}
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
            {props.team.homeFixture.table}
          </Text>
        </View>
      </ListItem>
      <Separator />
      <ListItem multiline>
        <View>
          <Text bold>
            {S.HOME_MATCH_TIME}
          </Text>
          <Text>{`${!isNaN(parseInt(props.team.homeFixture.day, 10))
            ? `${S.WEEKDAYS[props.team.homeFixture.day]} ${props.team
                .homeFixture.time
                ? `${S.TIME_AT} ${props.team.homeFixture.time}`
                : ''}`
            : '-'}`}</Text>
        </View>
      </ListItem>
    </ListItem.Group>
  );
}
