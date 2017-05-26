import React, { Component } from 'react';
import {
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { ANDROID_VERSION_LOLLIPOP } from '../../consts';

class Touchable extends Component {
  render() {
    const { style, ...rest } = this.props;
    if (
      Platform.OS === 'android' &&
      Platform.Version >= ANDROID_VERSION_LOLLIPOP
    ) {
      const useForeground = TouchableNativeFeedback.canUseNativeForeground()
        ? { useForeground: true }
        : {};
      return (
        <TouchableNativeFeedback
          {...rest}
          style={null}
          delayPressIn={30}
          background={TouchableNativeFeedback.Ripple(
            this.props.pressColor || 'rgba(0,0,0,.2)',
            true,
          )}
        >
          <View style={style}>
            {this.props.children}
          </View>
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <TouchableOpacity {...rest} style={style}>

          {this.props.children}

        </TouchableOpacity>
      );
    }
  }
}

export default Touchable;
