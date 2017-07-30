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
            {`${props.setPoints.set_points
              ? `${props.setPoints.set_points.home}:${props.setPoints.set_points
                  .away}`
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
            {`${props.goals.goals_home != null
              ? props.goals.goals_home
              : '-'}:${props.goals.goals_away != null
              ? props.goals.goals_away
              : '-'}`}
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
