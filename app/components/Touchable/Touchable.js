// @flow
import React from 'react';
import {
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
} from 'react-native';

type TouchableProps = {
  children: ReactElement<*>,
  style?: number | Array<*> | Object,
  pressColor?: string,
  button?: boolean,
};

export default function Touchable(props: TouchableProps): ReactElement<any> {
  const { style, pressColor, children, ...rest } = props;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    return (
      <TouchableNativeFeedback
        {...rest}
        delayPressIn={25}
        background={TouchableNativeFeedback.Ripple(
          pressColor ||
            (props.light ? 'rgba(255, 255, 255, .7)' : 'rgba(0,0,0,.2)'),
          !props.button,
        )}
        style={{ borderWidth: 1 }}
      >
        <View style={style}>
          {children}
        </View>
      </TouchableNativeFeedback>
    );
  } else {
    return (
      <TouchableOpacity {...rest} style={style}>
        {children}
      </TouchableOpacity>
    );
  }
}
