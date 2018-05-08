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
import { connect } from 'react-redux';
import {
  Card,
  Touchable,
  Text,
  Icon,
  Image,
  Score,
  ActionSheet,
} from '@app/components';
import { Strings } from '@app/lib/strings';
import { getFixtureGame } from '@app/redux/modules/fixtures';
import styles from './styles';

interface Props extends StateProps {
  editable: boolean;
  index: number;
  data: any;
  fixtureId: string;
  openPlayer: (player: any) => void;
  onSelect: (index: number, data: any, val: number) => () => void;
}

class SetItem extends React.PureComponent<Props> {
  private onShowMenu = () => {
    ActionSheet.show(
      {
        options: [Strings.SELECT_PLAYER, Strings.INSERT_SCORE],
      },
      (val: number) => {
        if (val < 3) {
          this.props.onSelect(this.props.index, this.props.data, val)();
        }
      },
    );
  };

  private onPress = () => {
    const { homePlayer1, homePlayer2 } = this.props.getSet(
      this.props.data.gameNumbers[0],
    );
    if (homePlayer1 && homePlayer2) {
      this.props.onSelect(this.props.index, this.props.data, 1)();
    } else {
      this.props.onSelect(this.props.index, this.props.data, 0)();
    }
  };

  private onOpenPlayer = (player: any) => () => {
    this.props.openPlayer(player);
  };

  private renderHomePlayer = (player: any) => {
    return (
      <View style={styles.containerPlayer}>
        <Text center style={styles.textPlayer} numberOfLines={2}>
          {`${
            player
              ? `${player.name} ${player.surname}`
              : this.props.editable
                ? Strings.SELECT
                : ''
          }`}
        </Text>
        {player && <Image url={player.image} size={32} />}
      </View>
    );
  };

  private renderAwayPlayer = (player: any) => {
    return (
      <View style={styles.containerPlayer}>
        {player && <Image url={player.image} size={32} />}
        <Text center style={styles.textPlayer} numberOfLines={2}>
          {`${
            player
              ? `${player.name} ${player.surname}`
              : this.props.editable
                ? Strings.SELECT
                : ''
          }`}
        </Text>
      </View>
    );
  };

  public render() {
    const Container = this.props.editable ? Touchable : View;
    const PlayerContianer = this.props.editable ? View : Touchable;

    const set = this.props.getSet(this.props.data.gameNumbers[0]);

    return (
      <Card>
        <Container onPress={this.onShowMenu} style={styles.container}>
          <View style={styles.containerTitle}>
            <Text bold secondary style={styles.textTitle}>
              {this.props.data.name}
            </Text>
            {this.props.editable && (
              <Icon style={styles.iconTitle} name="more" size={16} />
            )}
          </View>
        </Container>

        <Container
          onPress={this.onPress}
          style={{
            flexDirection: 'row',
            paddingBottom: 8,
            paddingHorizontal: 4,
          }}
        >
          <View style={styles.containerPlayers}>
            <PlayerContianer onPress={this.onOpenPlayer(set.homePlayer1)}>
              {this.renderHomePlayer(set.homePlayer1)}
            </PlayerContianer>
            {this.props.data.type === 'DOUBLES' && (
              <PlayerContianer onPress={this.onOpenPlayer(set.homePlayer2)}>
                {this.renderHomePlayer(set.homePlayer2)}
              </PlayerContianer>
            )}
          </View>

          <View style={{ justifyContent: 'space-around' }}>
            {this.props.data.gameNumbers.map((gameNumer: string) => (
              <Score
                goals={this.props.getSet(gameNumer).result}
                key={`goals-${gameNumer}`}
                style={{ marginVertical: 3 }}
              />
            ))}
          </View>

          <View style={styles.containerPlayers}>
            <PlayerContianer onPress={this.onOpenPlayer(set.awayPlayer1)}>
              {this.renderAwayPlayer(set.awayPlayer1)}
            </PlayerContianer>
            {this.props.data.type === 'DOUBLES' && (
              <PlayerContianer onPress={this.onOpenPlayer(set.awayPlayer2)}>
                {this.renderAwayPlayer(set.awayPlayer2)}
              </PlayerContianer>
            )}
          </View>
        </Container>
      </Card>
    );
  }
}

interface StateProps {
  getSet: (gameNumber: string) => any;
}

function mapStateToProps(state: any, props: Props): StateProps {
  return {
    getSet: (gameNumber: string) =>
      getFixtureGame(state, props.fixtureId, gameNumber),
  };
}

export const ConnectedSetItem = connect(mapStateToProps, null)(SetItem);
