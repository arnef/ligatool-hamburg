// @flow
import React, { Component } from 'react';
import { Switch as RNSwitch, Platform } from 'react-native';
import { connect } from 'react-redux';

class Switch extends Component {
  render() {
    const { color, ...rest } = this.props;
    if (Platform.OS === 'android') {
      return <RNSwitch {...rest} />; // onTintColor='#ccc' thumbTintColor={color} />
    } else {
      return <RNSwitch {...rest} onTintColor={color} />;
    }
  }
}

export default connect(state => ({
  color: state.settings.color,
}))(Switch);
