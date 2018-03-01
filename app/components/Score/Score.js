// @flow
import React from 'react';
import { View } from 'react-native';
import Text from '../Text';

import styles from './styles';

type ScoreProps = {
  setPoints?: Match,
  goals?: { goals_home?: number, goals_away?: number },
  style?: number | Object,
};

export default function Score(props: ScoreProps): ReactElement<any> {
  if (props.setPoints) {
    return (
      <View>
        <View style={[styles.score, { marginTop: 8 }]}>
          <Text style={styles.scoreText}>
            {`${props.setPoints.result
              ? `${props.setPoints.result.setPointsHomeTeam}:${props.setPoints
                  .result.setPointsAwayTeam}`
              : '-:-'}`}
          </Text>
        </View>
        <Text
          bold
          center
          small
          style={{ marginTop: 2 }}
          color={props.setPoints.live ? '#555' : 'transparent'}
        >
          LIVE
        </Text>
      </View>
    );
  } else if (props.goals) {
    return (
      <View style={{ borderWidth: 0 }}>
        <View style={[styles.score, { width: 48 }, props.style]}>
          <Text style={styles.scoreText}>
            {props.goals
              ? `${props.goals.goalsHome}:${props.goals.goalsAway}`
              : '-:-'}
          </Text>
        </View>
      </View>
    );
  } else {
    return (
      <View style={[styles.score, { width: 48 }, props.style]}>
        <Text style={styles.scoreText}>-:-</Text>
      </View>
    );
  }
}
