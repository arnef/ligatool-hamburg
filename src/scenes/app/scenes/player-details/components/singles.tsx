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
import { ListItem, Text, Score } from '@app/components';
import { View } from 'react-native';
import { Player } from './player';

interface Props {
  data: any;
  id: string;
}
export class Singles extends React.PureComponent<Props> {
  public render() {
    const { data, id } = this.props;
    const result =
      data.result === 'DRAW'
        ? { goalsHome: 1, goalsAway: 1 }
        : (data.results === 'WIN' && id === data.homePlayer.id) ||
          (data.results === 'LOST' && id === data.homePlayer.id)
          ? { goalsHome: 1, goalsAway: 0 }
          : { goalsHome: 0, goalsAway: 1 };

    return (
      <ListItem multiline>
        <View style={{ flex: 1 }}>
          <Text bold style={{ paddingBottom: 12 }}>
            {`${data.competitionName} - ${data.round}`}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Player player={data.homePlayer} reverse />
            <Score goals={result} />
            <Player player={data.awayPlayer} />
          </View>
        </View>
      </ListItem>
    );
  }
}
