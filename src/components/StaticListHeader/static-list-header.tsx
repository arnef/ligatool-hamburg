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

import { darken } from '@app/helper';
import * as React from 'react';
import { View, ViewStyle } from 'react-native';

import styles from './styles';

export interface IStaticListHeaderProps {
  style?: ViewStyle;
  color?: string;
}

export class StaticListHeader extends React.PureComponent<
  IStaticListHeaderProps
> {
  public render() {
    const headerStyle: ViewStyle[] = [
      styles.row,
      { backgroundColor: darken(this.props.color, 0.05) },
    ];

    if (this.props.style) {
      headerStyle.push(this.props.style);
    }

    return <View style={headerStyle}>{this.props.children}</View>;
  }
}
