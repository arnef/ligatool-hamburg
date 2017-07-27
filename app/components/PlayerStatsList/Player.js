// @flow
import React from 'react';
import { View } from 'react-native';
import { ListItem, Text, Image, MatchStatsBar } from '../../components';

import styles from './styles';

export default function Player(props): ReactElement<any> {
  return (
    <ListItem onPress={() => props.onPress(props.player)}>
      <View style={styles.position}>
        <Text>{`${props.position}`}</Text>
      </View>
      <Image url={props.player.image} size={32} style={styles.playerImage} />
      <View style={{ flex: 1 }}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.playerName}>
            {`${props.player.name} ${props.player.surname}`}
          </Text>
          <Text style={styles.rate}>{`${props.rate}`}</Text>
          <Text style={styles.matches}>{`${props.matches}`}</Text>
          <Text
            style={styles.competitiveIndex}
          >{`${props.competitive_index}`}</Text>
        </View>
        <View style={styles.row}>
          <MatchStatsBar small stats={props} />
        </View>
      </View>
    </ListItem>
  );
}
