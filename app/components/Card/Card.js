// @flow
import React from 'react';
import { View } from 'react-native';
import Touchable from '../Touchable';

import styles from './styles';

type CardProps = {
  children: Array<ReactElement<*>>,
  onPress?: Function,
};

export default function Card(props: CardProps): ReactElement<any> {
  const Container = props.onPress ? Touchable : View;
  return (
    <View style={styles.card}>
      <Container onPress={props.onPress}>
        {props.children}
      </Container>
    </View>
  );
}
