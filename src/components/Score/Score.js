import React from 'react';
import { View } from 'react-native';
import Text from '../Text';

import styles from './styles';
import { STATUS_FINISHED, STATUS_IN_PLAY } from '../../redux/modules/fixtures';
import { Strings as S } from '../../lib/strings';

export default function Score(props) {
  if (props.setPoints) {
    return (
      <View>
        <View style={[styles.score, { marginTop: 8 }]}>
          <Text style={styles.scoreText} numberOfLines={1}>
            {`${
              props.setPoints.result
                ? `${props.setPoints.result.setPointsHomeTeam}:${
                    props.setPoints.result.setPointsAwayTeam
                  }`
                : '-:-'
            }`}
          </Text>
        </View>
        <Text
          bold
          center
          small
          style={{ marginTop: 2 }}
          numberOfLines={1}
          color={
            props.status === STATUS_IN_PLAY || props.status === STATUS_FINISHED
              ? '#555'
              : 'transparent'
          }
        >
          {`${props.status === STATUS_IN_PLAY ? S.LIVE : S.UNCONFIRMED}`}
        </Text>
      </View>
    );
  } else if (props.goals) {
    return (
      <View style={{ borderWidth: 0 }}>
        <View style={[styles.score, { width: 48 }, props.style]}>
          <Text style={styles.scoreText} numberOfLines={1}>
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
