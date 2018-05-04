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
import { Content, Separator, ListItem, Text, Icon } from '../../components';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { connect, Dispatch } from 'react-redux';
import {
  getFixturePlayerList,
  getFixtureModus,
  getFixtureGame,
  getFixtureGames,
  setFixtureGameHomePlayer,
  setFixtureGameAwayPlayer,
} from '../../redux/modules/fixtures';
import {
  getNavigationStateParams,
  navigate,
  hidePlayer,
} from '../../redux/modules/navigation';
import { Routes } from 'src/scenes/routes';
import {
  headerNavigationOptions,
  HeaderCloseIcon,
} from '../../containers/navigation';
import { Strings } from 'src/lib/strings';

interface Props extends StateProps, DispatchProps {
  navigation: any;
}
interface State {
  disabled: Array<string>;
  selected: Array<number>;
}
class SelectPlayerScene extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      disabled: this.validate(),
      selected: [],
    };
  }

  private validate = (selectedPlayer: any = null): Array<string> => {
    const { modus, sets } = this.props;
    const { data, team } = getNavigationStateParams(this.props.navigation);
    console.log(
      'val?',
      modus.validator,
      modus.lineUp[modus.fixtureModus],
      data.gameNumbers[0],
      modus.validator.ignoreAfter,
    );
    const disabled: Array<string> = [];
    if (
      modus.validator &&
      modus.lineUp &&
      modus.lineUp[modus.fixtureModus] &&
      parseInt(data.gameNumbers[0], 10) <=
        parseInt(modus.validator.ignoreAfter, 10)
    ) {
      console.log('validate');
      const lineUp = modus.lineUp[modus.fixtureModus];
      const count: Map<string, number> = new Map();
      const playedDoubles: Map<string, number> = new Map();
      for (let set of lineUp) {
        for (let gameNumber of set.gameNumbers) {
          if (
            gameNumber < data.gameNumbers[0] ||
            gameNumber > data.gameNumbers[data.gameNumbers.length - 1]
          ) {
            console.log(set.type, data.type, sets[gameNumber]);
            if (
              set.type === data.type &&
              sets[gameNumber] &&
              sets[gameNumber][`${team}Player1`]
            ) {
              const key1 = sets[gameNumber][`${team}Player1`].id;
              const key2 = sets[gameNumber][`${team}Player2`]
                ? sets[gameNumber][`${team}Player2`].id
                : null;
              let doublesKey = null;
              const maxCount = !key2
                ? modus.validator.maxCountSingles
                : modus.validator.maxCountDoubles;

              if (!count.has(key1)) {
                count.set(key1, 0);
              }
              count.set(key1, count.get(key1) + 1);

              if (key2) {
                if (!count.has(key2)) {
                  count.set(key2, 0);
                }
                count.set(key2, count.get(key2) + 1);

                doublesKey = playedDoubles.has(`${key1}${key2}`)
                  ? `${key1}${key2}`
                  : `${key2}${key1}`;

                if (!playedDoubles.has(doublesKey)) {
                  playedDoubles.set(doublesKey, 0);
                }
                playedDoubles.set(
                  doublesKey,
                  playedDoubles.get(doublesKey) + 1,
                );
              }

              if (count.get(key1) >= maxCount) {
                disabled.push(key1);
              }
              if (key2 && count.get(key2) >= maxCount) {
                disabled.push(key2);
              }

              if (
                key2 &&
                selectedPlayer &&
                doublesKey &&
                modus.validator.equalDoubles > 0 &&
                playedDoubles.get(doublesKey) >= modus.validator.equalDoubles
              ) {
                disabled.push(doublesKey.replace(selectedPlayer, ''));
              }
              console.log(count, playedDoubles);
            }
          }
        }
      }
    }

    return disabled;
  };

  private onSelectPlayer = (index: number) => () => {
    const params = getNavigationStateParams(this.props.navigation);
    const { player } = this.props;
    const idx = this.state.selected.indexOf(index);
    const selected = [...this.state.selected];
    let playerId = null;
    if (idx !== -1) {
      selected.splice(idx, 1);
    } else if (selected.length < (params.data.type === 'DOUBLES' ? 2 : 1)) {
      selected.push(index);
      playerId = player[index].id;
    }

    this.setState({ selected, disabled: this.validate(playerId) }, () => {
      if (selected.length === (params.data.type === 'DOUBLES' ? 2 : 1)) {
        const result = [];
        for (let itemIdx of selected) {
          result.push(player[itemIdx]);
        }
        this.props.setPlayer(result);
        setTimeout(() => {
          if (params.team === 'home') {
            this.props.next();
          } else {
            this.props.close();
          }
        }, 10);
      }
    });
  };

  private renderItem = ({ item, index }: any) => {
    const disabled = this.state.disabled.indexOf(item.id) !== -1;
    const selected = this.state.selected.indexOf(index) !== -1;
    return (
      <ListItem onPress={this.onSelectPlayer(index)} disabled={disabled}>
        <ListItem.Image url={item.image} />
        <Text>{`${item.name} ${item.surname}`}</Text>
        <View style={{ flex: 1 }} />
        <ListItem.Icon
          right
          size={24}
          name={selected ? 'checkbox' : 'square-outline'}
        />
      </ListItem>
    );
  };

  private renderSeparator = () => {
    return <Separator image />;
  };

  public render() {
    return (
      <Content
        data={this.props.player}
        renderItem={this.renderItem}
        extraData={this.state.selected}
        renderSeparator={this.renderSeparator}
      />
    );
  }
}

interface StateProps {
  player: Array<any>;
  modus: any;
  sets: any;
}
interface DispatchProps {
  next: Function;
  close: Function;
  setPlayer: Function;
}

function mapStateToProps(state: any, props: Props): StateProps {
  const { matchId, team } = getNavigationStateParams(props.navigation);
  return {
    player: getFixturePlayerList(state, matchId, team),
    modus: getFixtureModus(state, matchId),
    sets: getFixtureGames(state, matchId),
  };
}

function mapDispatchToProps(
  dispatch: Dispatch<any>,
  props: Props,
): DispatchProps {
  const params = getNavigationStateParams(props.navigation);
  return {
    next: () =>
      dispatch(
        navigate({
          routeName: Routes.selectPlayer,
          params: {
            ...params,
            team: 'away',
            title: `${params.data.name} ${Strings.AWAY}`,
          },
        }),
      ),
    close: () => dispatch(hidePlayer()),
    setPlayer: (player: any) =>
      dispatch(
        params.team === 'home'
          ? setFixtureGameHomePlayer(
              params.matchId,
              params.data.gameNumbers,
              player,
            )
          : setFixtureGameAwayPlayer(
              params.matchId,
              params.data.gameNumbers,
              player,
            ),
      ),
  };
}

const SelectPlayer = connect(mapStateToProps, mapDispatchToProps)(
  SelectPlayerScene,
);

export const SelectPlayerScenes = StackNavigator(
  {
    [Routes.selectPlayer]: {
      screen: SelectPlayer,
      navigationOptions: ({ navigation }) => ({
        title: getNavigationStateParams(navigation).title,
        headerLeft:
          getNavigationStateParams(navigation).team === 'away'
            ? undefined
            : HeaderCloseIcon(navigation, hidePlayer()),
      }),
    },
  },
  headerNavigationOptions,
);
