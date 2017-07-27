// @flow
import React from 'react';
import { View } from 'react-native';
import { ListItem, Text, TeamLogo, MatchStatsBar } from '../../components';

import styles from './styles';

export default function TableItem(props): ReactElement<any> {
  return (
    <ListItem onPress={() => props.onPress(props.data)}>
      <Text style={styles.position}>
        {`${props.data.position}`}
      </Text>
      <View style={styles.teamLogo}>
        <TeamLogo team={props.data} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.row}>
          <Text style={styles.teamName} numberOfLines={1}>
            {props.data.name}
          </Text>
          <Text style={styles.matches}>
            {`${props.data.matches}`}
          </Text>
          <Text style={styles.setPoints}>
            {`${props.data.set_points_diff}`}
          </Text>
          <Text style={styles.goals}>
            {`${props.data.goals_diff}`}
          </Text>
          <Text style={styles.points}>
            {`${props.data.points}`}
          </Text>
        </View>
        <View style={styles.row}>
          <MatchStatsBar
            small
            stats={{
              wins: props.data.wins,
              lost: props.data.defeats,
              draws: props.data.draws,
              matches: props.data.matches,
            }}
          />
        </View>
      </View>
    </ListItem>
  );
}
