// @flow
import React from 'react';
import { View } from 'react-native';
import Touchable from '../Touchable';
import Icon from '../Icon';
import Text from '../Text';

import styles from './styles';

type ErrorFlashProps = {
  error?: string,
  onRefresh: Function,
};

export default function ErrorFlash(props: ErrorFlashProps): ReactElement<any> {
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
