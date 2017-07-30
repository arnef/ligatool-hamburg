// @flow
import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Touchable from '../Touchable';
import Text from '../Text';

import styles from './styles';

type MatchHeaderProps = {
  home: string,
  away: string,
  points?: { home: number, away: number },
  goals?: { home: number, away: number },
  onPress: Function,
  color: string,
};

function MatchHeader(props: MatchHeaderProps): ReactElement<any> {
  return (
    <View style={[styles.container, { backgroundColor: props.color }]}>
      <Touchable
        light
        borderless
        style={styles.containerTeam}
        onPress={() => props.onPress('team_home')}
      >
        <Text style={styles.textTeam} numberOfLines={2}>
          {`${props.home}`}
        </Text>
      </Touchable>
      <View style={styles.containerScore}>
        <Text style={styles.textScore}>
          {`${props.points
            ? `${props.points.home}:${props.points.away}`
            : '-:-'}`}
        </Text>
        <Text small style={styles.textScore}>
          {`(${props.goals &&
          props.goals.home != null &&
          props.goals.away != null
            ? `${props.goals.home}:${props.goals.away}`
            : '-:-'})`}
        </Text>
      </View>
      <Touchable
        light
        borderless
        style={styles.containerTeam}
        onPress={() => props.onPress('team_away')}
      >
        <Text style={styles.textTeam} numberOfLines={2}>
          {`${props.away}`}
        </Text>
      </Touchable>
    </View>
  );
}

export default connect(state => ({
  color: state.settings.color,
}))(MatchHeader);
