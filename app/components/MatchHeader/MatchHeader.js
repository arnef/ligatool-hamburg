import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Touchable from '../Touchable';
import Text from '../Text';

import styles from './styles';
import { getColor } from '../../redux/modules/user';

function MatchHeader(props) {
  return (
    <View style={[styles.container, { backgroundColor: props.color }]}>
      <Touchable
        light
        borderless
        style={styles.containerTeam}
        onPress={() => props.onPress('home')}
      >
        <Text style={styles.textTeam} numberOfLines={2}>
          {`${props.home}`}
        </Text>
      </Touchable>
      <View style={styles.containerScore}>
        <Text style={styles.textScore}>
          {`${props.result
            ? `${props.result.setPointsHomeTeam}:${props.result
                .setPointsAwayTeam}`
            : '-:-'}`}
        </Text>
        <Text small style={styles.textScore}>
          {`(${props.result
            ? `${props.result.goalsHomeTeam}:${props.result.goalsAwayTeam}`
            : '-:-'})`}
        </Text>
      </View>
      <Touchable
        light
        borderless
        style={styles.containerTeam}
        onPress={() => props.onPress('away')}
      >
        <Text style={styles.textTeam} numberOfLines={2}>
          {`${props.away}`}
        </Text>
      </Touchable>
    </View>
  );
}

export default connect(state => ({
  color: getColor(state),
}))(MatchHeader);
