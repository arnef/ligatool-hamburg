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

import { Text, Touchable } from '@app/components';
import { IS_ANDROID } from '@app/consts';
import * as React from 'react';
import { View, ViewStyle } from 'react-native';

import styles from './styles';

export interface IButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  outline?: boolean;
  square?: boolean;
  disabled?: boolean;
}

export class Button extends React.PureComponent<IButtonProps> {
  public render() {
    const { color, outline } = this.props;
    const style: ViewStyle[] = [
      styles.button,
      { borderColor: color, borderWidth: 1 },
    ];
    if (!outline) {
      style.push({ backgroundColor: color, borderWidth: 1 });
    }
    if (this.props.square) {
      style.push({ borderRadius: 0 });
    }
    const Container = this.props.disabled ? View : Touchable;
    return (
      <Container
        style={style}
        button
        pressColor={outline ? color : 'rgba(255,255,255,.7)'}
        onPress={this.props.onPress}
      >
        <Text color={outline ? color : '#fff'} bold={IS_ANDROID}>
          {IS_ANDROID ? this.props.title.toUpperCase() : this.props.title}
        </Text>
      </Container>
    );
  }
}
