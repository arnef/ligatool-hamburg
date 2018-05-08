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
  Text as RNText,
  TextProperties,
  TextStyle,
  ViewStyle,
} from 'react-native';

import styles from './styles';

interface Props extends TextProperties {
  color?: string;
  secondary?: boolean;
  bold?: boolean;
  center?: boolean;
  small?: boolean;
}

export class Text extends React.PureComponent<Props> {
  public render() {
    const {
      color,
      secondary,
      bold,
      center,
      small,
      children,
      ...rest
    } = this.props;
    const style: Array<TextStyle> = [styles.text];
    if (color) {
      style.push({ color });
    }
    if (secondary) {
      style.push(styles.secondary);
    }
    if (bold) {
      style.push(styles.bold);
    }
    if (center) {
      style.push(styles.center);
    }
    if (small) {
      style.push(styles.small);
    }
    if (this.props.style) {
      if (this.props.style instanceof Array) {
        this.props.style.forEach((s: ViewStyle) => style.push(s));
      } else {
        style.push(this.props.style);
      }
    }
    return (
      <RNText {...rest} ellipsizeMode={'tail'} style={style}>
        {typeof children === 'number' ? `${children}` : children}
      </RNText>
    );
  }
}
