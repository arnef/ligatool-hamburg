import React from 'react';
import { Switch as RNSwitch, Platform, View } from 'react-native';
import { connect } from 'react-redux';
import Touchable from '../Touchable';
import Text from '../Text';

import styles from './styles';
import { getColor } from '../../redux/modules/user';

function Switch(props) {
  const { title, onValueChange, disabled, color, ...rest } = props;

  if (Platform.OS === 'android') {
    const Container = disabled ? View : Touchable;
    return (
      <Container style={styles.container} onPress={onValueChange}>
        <Text style={styles.title}>{title}</Text>
        <RNSwitch {...rest} disabled={disabled} onValueChange={onValueChange} />
      </Container>
    ); // onTintColor='#ccc' thumbTintColor={color} />
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <RNSwitch
          {...rest}
          disabled={disabled}
          onValueChange={onValueChange}
          onTintColor={color}
        />
      </View>
    );
  }
}

export default connect(state => ({
  color: getColor(state),
}))(Switch);
