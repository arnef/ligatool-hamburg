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
import { View, ViewStyle } from 'react-native';

import styles from './styles';

interface IProps {
  image?: boolean;
  table?: boolean;
  full?: boolean;
  group?: boolean;
}

export class Separator extends React.PureComponent<IProps> {
  public render() {
    const style: ViewStyle[] = [styles.separator];
    let marginLeft = 16;
    if (this.props.image) {
      marginLeft += 48;
    }
    if (this.props.table) {
      marginLeft += 24;
    }
    if (this.props.full) {
      marginLeft = 0;
    }
    if (this.props.group) {
      marginLeft = 0;
      style.push({ height: 12 });
    }
    style.push({ marginLeft });

    return (
      <View style={styles.container}>
        <View style={style} />
      </View>
    );
  }
}
