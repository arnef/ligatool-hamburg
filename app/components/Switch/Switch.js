// @flow
import React from 'react';
import { Switch as RNSwitch, Platform } from 'react-native';
import { connect } from 'react-redux';

type SwitchProps = {
  color?: string,
} & RNSwitch;

function Switch(props: SwitchProps): ReactElement<any> {
  const { color, ...rest } = props;

  if (Platform.OS === 'android') {
    return <RNSwitch {...rest} />; // onTintColor='#ccc' thumbTintColor={color} />
  } else {
    return <RNSwitch {...rest} onTintColor={color} />;
  }
}

export default connect(state => ({
  color: state.settings.color,
}))(Switch);
