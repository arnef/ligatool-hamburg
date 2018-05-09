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

import { Icon, Image } from '@app/components';
import * as React from 'react';
import { ViewStyle } from 'react-native';

import styles from './styles';

const iconSize: number = 32;
const bigIconSize: number = 42;

interface IProps {
  team?: string;
  left?: boolean;
  size?: number;
  big?: boolean;
}

export class TeamLogo extends React.PureComponent<IProps> {
  public render() {
    const style: ViewStyle[] = [styles.image];
    if (this.props.left) {
      style.push({ marginHorizontal: 0, marginRight: 16 });
    }
    const size = this.props.size || (this.props.big ? bigIconSize : iconSize);
    if (this.props.team) {
      return <Image style={style} size={size} url={this.props.team} />;
    } else {
      return <Icon size={size} name="shirt" style={style} />;
    }
  }
}
