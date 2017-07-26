// @flow
import React from 'react';
import { Switch as RNSwitch, Platform, View } from 'react-native';
import { connect } from 'react-redux';
import Touchable from '../Touchable';
import Text from '../Text';

import styles from './styles';

type SwitchProps = {
  title: string,
  color?: string,
} & RNSwitch;

function Switch(props: SwitchProps): ReactElement<any> {
  const { title, onValueChange, color, ...rest } = props;

  if (Platform.OS === 'android') {
    return (
      <Touchable style={styles.container} onPress={onValueChange}>
        <Text style={styles.title}>
          {title}
        </Text>
        <RNSwitch {...rest} onValueChange={onValueChange} />
      </Touchable>
    ); // onTintColor='#ccc' thumbTintColor={color} />
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {title}
        </Text>
        <RNSwitch {...rest} onValueChange={onValueChange} onTintColor={color} />
      </View>
    );
  }
}

export default connect(state => ({
  color: state.settings.color,
}))(Switch);
