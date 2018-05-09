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
import { Image, Text, View } from 'react-native';

import styles from './styles';

export class LaunchScreen extends React.PureComponent {
  public render() {
    return (
      <View style={styles.container}>
        <Image source={{ uri: 'appicon' }} style={styles.icon} />
        <View style={{ position: 'absolute', bottom: 32 }}>
          <Text style={[styles.text]}>
            {'powered by '}
            <Text style={[styles.text, styles.textBig]}>Arne Feil</Text>
          </Text>
        </View>
      </View>
    );
  }
}
