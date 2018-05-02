import React from 'react';
import { View } from 'react-native';
import { ListItem, Text, TeamLogo, MatchStatsBar } from '../../components';

import styles from './styles';

export default function TableItem(props) {
  const { details } = props;
  return (
    <ListItem onPress={() => props.onPress(props.data)}>
      <Text style={styles.position}>{`${props.data.rank}`}</Text>
      <View style={styles.teamLogo}>
        <TeamLogo team={props.data.teamEmblemUrl} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.row}>
          <Text style={styles.teamName} numberOfLines={1}>
            {props.data.teamName}
          </Text>
          {details && (
            <Text style={styles.matches}>{`${props.data.playedGames}`}</Text>
          )}
          {details && (
            <Text style={styles.setPoints}>
              {`${props.data.setPointsDifference}`}
            </Text>
          )}
          {details && (
            <Text style={styles.goals}>{`${props.data.goalsDifference}`}</Text>
          )}
          {details && (
            <Text style={styles.points}>{`${props.data.points}`}</Text>
          )}
        </View>
        {details && (
          <View style={styles.row}>
            <MatchStatsBar
              small
              stats={{
                wins: props.data.overallWin,
                lost: props.data.overallLost,
                draws: props.data.overallDraw,
                matches: props.data.playedGames,
              }}
            />
          </View>
        )}
      </View>
    </ListItem>
  );
}
