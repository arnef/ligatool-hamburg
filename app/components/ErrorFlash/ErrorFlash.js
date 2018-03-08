import React from 'react';
import { View } from 'react-native';
import Touchable from '../Touchable';
import Icon from '../Icon';
import Text from '../Text';

import styles from './styles';

export default function ErrorFlash(props) {
  if (props.error) {
    const error = { color: 'orange', message: props.error };

    return (
      <View style={{ backgroundColor: error.color }}>
        <Touchable onPress={props.onRefresh}>
          <View style={styles.container}>
            <Text color={'#fff'} style={styles.text}>
              {error.message}
            </Text>
            <Icon color={'#fff'} name={'refresh'} size={22} />
          </View>
        </Touchable>
      </View>
    );
  } else {
    return <View />;
  }
}
