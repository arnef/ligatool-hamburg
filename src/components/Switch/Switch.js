import React from 'react';
import { Switch as RNSwitch, Platform, View } from 'react-native';
import { connect } from 'react-redux';
import Touchable from '../Touchable';
import Text from '../Text';

import styles from './styles';
import { getColor } from '../../redux/modules/user';
import { lighten } from '../../helper';

function Switch(props) {
  const { title, onValueChange, disabled, color, value, ...rest } = props;

  if (Platform.OS === 'android') {
    const Container = disabled ? View : Touchable;
    return (
      <Container style={styles.container} onPress={onValueChange}>
        <Text style={styles.title}>{title}</Text>
        <RNSwitch
          {...rest}
          value={value}
          disabled={disabled}
          onTintColor={lighten(color, 0.3)}
          tintColor={'#b2b2b2'}
          thumbTintColor={value ? color : '#ececec'}
          onValueChange={onValueChange}
        />
      </Container>
    ); //  />
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <RNSwitch
          {...rest}
          value={value}
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
