import React, { Component } from 'react';
import {
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform
} from 'react-native';
import { ANDROID_VERSION_LOLLIPOP } from '../../consts';

class Touchable extends Component {
  render() {
    if (
      Platform.OS === 'android' &&
      Platform.Version >= ANDROID_VERSION_LOLLIPOP
    ) {
      const { style, ...rest } = this.props;

      return (
        <TouchableNativeFeedback
          {...rest}
          style={null}
          delayPressIn={50}
          background={TouchableNativeFeedback.Ripple(
            this.props.pressColor,
            this.props.borderless
          )}
        >
          <View style={style}>
            {this.props.children}
          </View>
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <TouchableOpacity {...this.props}>
          {this.props.children}
        </TouchableOpacity>
      );
    }
  }
}

export default Touchable;
