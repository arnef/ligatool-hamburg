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
  Switch as RNSwitch,
  SwitchProperties,
  Platform,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { Touchable, Text } from '@app/components';
import { getColor } from '@app/redux/modules/user';
import { lighten } from '@app/helper';
import styles from './styles';

export interface SwitchProps extends SwitchProperties {
  title: string;
  color?: string;
}

export class Switch extends React.PureComponent<SwitchProps> {
  public render() {
    const {
      title,
      onValueChange,
      disabled,
      color,
      value,
      ...rest
    } = this.props;

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
      );
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
}
