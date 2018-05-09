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

import { Text } from '@app/components';
import * as React from 'react';
import { View } from 'react-native';

interface ISectionHeaderProps {
  title: string;
}

export class SectionHeader extends React.PureComponent<ISectionHeaderProps> {
  public render() {
    return (
      <View style={{ paddingTop: 4, elevation: 5, alignItems: 'center' }}>
        <View
          style={{
            backgroundColor: '#dedede',
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
        >
          <Text bold>{`${this.props.title}`}</Text>
        </View>
      </View>
    );
  }
}
