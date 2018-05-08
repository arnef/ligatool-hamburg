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
import { View } from 'react-native';
import { ListItem, Text, Score } from '@app/components';
import { Player } from './player';

interface Props {
  id: string;
  data: any;
}

export class Doubles extends React.PureComponent<Props> {
  public render() {
    const { data } = this.props;
    const result =
      data.result === 'DRAW'
        ? { goalsHome: 1, goalsAway: 1 }
        : (data.result === 'WIN' &&
            (this.props.id === data.homePlayer1.id ||
              this.props.id === data.homePlayer2)) ||
          (data.results === 'LOST' &&
            (this.props.id === data.homePlayer1.id &&
              this.props.id !== data.homePlayer2.id))
          ? { goalsHome: 1, goalsAway: 0 }
          : { goalsHome: 0, goalsAway: 1 };

    return (
      <ListItem multiline>
        <View style={{ flex: 1 }}>
          <Text bold style={{ paddingBottom: 12 }}>
            {`${data.competitionName} - ${data.round}`}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Player reverse player={data.homePlayer1} />
              <Player reverse player={data.homePlayer2} />
            </View>
            <Score goals={result} />
            <View style={{ flex: 1 }}>
              <Player player={data.awayPlayer1} />
              <Player player={data.awayPlayer2} />
            </View>
          </View>
        </View>
      </ListItem>
    );
  }
}
