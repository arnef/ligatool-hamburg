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

import { Image, Text } from '@app/components';
import * as React from 'react';
import { View } from 'react-native';

interface IProps {
  reverse?: boolean;
  player: any;
}
export class Player extends React.PureComponent<IProps> {
  public render() {
    const { player } = this.props;
    return (
      <View
        style={{
          alignItems: 'center',
          flex: 2,
          flexDirection: this.props.reverse ? 'row-reverse' : 'row',
          margin: 3,
        }}
      >
        <Image url={player.image} size={32} />
        <Text center style={{ flex: 1 }}>
          {`${player.name} ${player.surname}`}
        </Text>
      </View>
    );
  }
}
