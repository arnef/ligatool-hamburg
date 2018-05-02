import React from 'react';
import { View } from 'react-native';
import Touchable from '../Touchable';

import styles from './styles';

export default function Card(props) {
  const Container = props.onPress ? Touchable : View;
  return (
    <View style={[styles.card, props.style]}>
      <Container onPress={props.onPress}>{props.children}</Container>
    </View>
  );
}
