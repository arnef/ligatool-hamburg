/**
 * Copyright (C) 2018 Arne Feil
 *
 * This file is part of DTFB App.
 *
 * DTFB App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DTFB App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DTFB App.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import * as React from 'react';
import {
  View,
  TouchableNativeFeedback,
  TouchableOpacity,
  Platform,
  ViewStyle,
} from 'react-native';

interface Props {
  style?: ViewStyle;
  pressColor?: string;
  light?: boolean;
  button?: boolean;
  onPress?: () => void;
}

export class Touchable extends React.PureComponent<Props> {
  public render() {
    const { style, pressColor, children, ...rest } = this.props;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
      return (
        <TouchableNativeFeedback
          {...rest}
          delayPressIn={25}
          background={TouchableNativeFeedback.Ripple(
            pressColor ||
              (this.props.light ? 'rgba(255, 255, 255, .7)' : 'rgba(0,0,0,.2)'),
            !this.props.button,
          )}
          style={{ borderWidth: 1 }}
        >
          <View style={style}>{children}</View>
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
}
