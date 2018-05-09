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

import { IS_ANDROID } from '@app/consts';
import * as React from 'react';
import { Text, TextStyle } from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

import styles from './styles';

interface IProps {
  /**
   * Name of the icon
   */
  name: string;
  /**
   * Size of the icon
   */
  size?: number;
  /**
   * Color of the icon
   */
  color?: string;
  style?: TextStyle | TextStyle[];
}
export class Icon extends React.PureComponent<IProps> {
  public render() {
    let name: string = IS_ANDROID
      ? `md-${this.props.name}`
      : `ios-${this.props.name}`;

    if (this.props.name === 'caret-forward') {
      name = 'ios-arrow-forward-outline';
    } else if (this.props.name === 'close') {
      name = 'md-close';
    }
    const style: TextStyle[] = [
      styles.icon,
      { height: this.props.size, width: this.props.size },
    ];
    if (this.props.style) {
      if (this.props.style instanceof Array) {
        this.props.style.forEach(s => style.push(s));
      } else {
        style.push(this.props.style);
      }
    }
    return (
      <Text style={style}>
        <IonIcon name={name} size={this.props.size} color={this.props.color} />
      </Text>
    );
  }
}
