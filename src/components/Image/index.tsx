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
import { Image as RNImage, ViewStyle, ImageURISource } from 'react-native';

import styles from './styles';

interface Props {
  url?: string;
  source?: any;
  size?: number;
  width?: number;
  height?: number;
  style?: ViewStyle | Array<ViewStyle>;
}

export class Image extends React.PureComponent<Props> {
  public render() {
    const source: ImageURISource = this.props.url
      ? { uri: this.props.url }
      : this.props.source;
    const style: Array<ViewStyle> = [styles.image];
    if (this.props.size) {
      style.push({ height: this.props.size, width: this.props.size });
    }
    if (this.props.height && this.props.width) {
      style.push({ width: this.props.width, height: this.props.height });
    }
    if (this.props.style) {
      if (this.props.style instanceof Array) {
        this.props.style.forEach(s => style.push(s));
      } else {
        style.push(this.props.style);
      }
    }
    return <RNImage source={source} style={style} />;
  }
}
