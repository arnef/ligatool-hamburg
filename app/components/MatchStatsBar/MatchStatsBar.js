// @flow
import React from 'react';
import { View, Text } from 'react-native';
import { WITH_DRAW } from '../../config/settings';
import styles from './styles';

type MatchStatsBarProps = {
  stats: {
    wins: number,
    draws: number,
    lost: number,
    matches: number,
  },
};

export default function MatchStatsBar(
  props: MatchStatsBarProps,
): ReactElement<any> {
  const height = props.small ? 14 : 14;
  const wins = [
    styles.wins,
    {
      flex: props.stats.wins / props.stats.matches,
      height,
    },
  ];
  const draws = [
    styles.draws,
    {
      flex: props.stats.draws / props.stats.matches,
      height,
    },
  ];
  const lost = [
    styles.lost,
    {
      flex: props.stats.lost / props.stats.matches,
      height,
    },
  ];

  if (props.stats.wins === 0) {
    draws.push({
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
    });
    if (props.stats.draws === 0) {
      lost.push({
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
      });
    }
  }

  if (props.stats.lost === 0) {
    draws.push({
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
    });
    if (props.stats.draws === 0) {
      wins.push({
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
      });
    }
  }
  return (
    <View style={styles.barContainer}>
      <View style={wins}>
        {props.stats.wins > 0 &&
          <Text style={styles.text}>{`${props.stats.wins}`}</Text>}
      </View>
      <View style={draws}>
        {props.stats.draws > 0 &&
          <Text style={styles.text}>{`${props.stats.draws}`}</Text>}
      </View>
      <View style={lost}>
        {props.stats.lost > 0 &&
          <Text style={styles.text}>{`${props.stats.lost}`}</Text>}
      </View>
    </View>
  );
}
