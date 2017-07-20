// @flow
import React from 'react';
import { View, Platform } from 'react-native';
import { Text, Touchable } from '../base';
import { connect } from 'react-redux';

import styles from './styles';

type ButtonProps = {
  title: string,
  onPress: Function,
  color: string,
  loading?: boolean,
  outline?: boolean,
  disabled?: boolean,
};

function Button(props: ButtonProps): ReactElement<any> {
  const btnStyle = [
    styles.button,
    { borderColor: props.color, borderWidth: 1 },
  ];
  if (!props.outline) {
    btnStyle.push({ backgroundColor: props.color, borderWidth: 0 });
  }
  if (props.disabled) {
    btnStyle.push(styles.disabled);
  }
  const isAndroid = Platform.OS === 'android';
  const Container = props.disabled || props.loading ? View : Touchable;

  return (
    <Container
      style={btnStyle}
      pressColor={props.outline ? props.color : 'rgba(255,255,255,0.7)'}
      onPress={props.onPress}
    >
      <Text color={props.outline ? props.color : '#fff'} bold={isAndroid}>
        {isAndroid ? props.title.toUpperCase() : props.title}
      </Text>
    </Container>
  );
}

export default connect(state => ({
  color: state.settings.color,
}))(Button);
