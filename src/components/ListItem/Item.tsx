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
  Platform,
  StyleSheet,
  ViewStyle,
  ColorPropType,
} from 'react-native';
import { Touchable } from '@app/components';
import { IS_IOS } from '@app/consts';
import styles from './styles';

interface Props {
  /**
   *
   */
  icon?: boolean;
  /**
   *
   */
  multiline?: boolean;
  /**
   *
   */
  disabled?: boolean;
  /**
   *
   */
  active?: boolean;
  /**
   *
   */
  center?: boolean;
  /**
   *
   */
  onPress?: () => void;
}

export class ListItem extends React.PureComponent<Props> {
  static ITEM_HEIGHT: number = IS_IOS ? 44 : 48;
  static Image: any;
  static Icon: any;
  static Group: any;
  static Header: any;

  public render() {
    const Container =
      this.props.onPress && !this.props.disabled ? Touchable : View;
    const style: Array<ViewStyle> = [styles.item];
    if (this.props.icon) {
      style.push({ marginLeft: 64 });
    }
    if (this.props.disabled) {
      style.push(styles.disabled);
    }
    if (this.props.multiline) {
      style.push({
        paddingVertical: IS_IOS ? 12 : 14,
        height: undefined,
        alignItems: 'flex-start',
      });
    }
    if (this.props.center) {
      style.push({ alignItems: 'center' });
    }

    return (
      <View
        style={
          this.props.active
            ? { backgroundColor: '#dedede' }
            : { backgroundColor: '#fff' }
        }
      >
        <Container onPress={this.props.onPress} style={style}>
          {this.props.children}
        </Container>
      </View>
    );
  }
}
