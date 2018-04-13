import React, { Component } from 'react';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import * as MatchActions from '../redux/modules/matches';

import {
  navigate,
  hidePlayer,
  getNavigationStateParams,
} from '../redux/modules/navigation';
import { Container, ListItem, Text, Separator } from '../components';
import NavHeader from '../Nav/NavHeader';
import NavCloseIcon from '../Nav/NavCloseIcon';

import S from '../lib/strings';
import {
  getFixturePlayerList,
  setFixtureGameHomePlayer,
  setFixtureGameAwayPlayer,
  getFixtureModus,
  getFixtureGames,
} from '../redux/modules/fixtures';

class SelectPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      disabled: this.validate(),
    };
    this.onPress = this.onPress.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  validate = (selectedPlayer = null) => {
    const { modus, sets } = this.props;
    const { data, team } = getNavigationStateParams(this.props.navigation);

    const disabled = [];
    if (
      modus.validator &&
      modus.lineUp &&
      modus.lineUp[modus.fixtureModus] &&
      data.gameNumbers[0] <= modus.validator.ignoreAfter
    ) {
      const lineup = modus.lineUp[modus.fixtureModus];
      const count = {};
      const playedDoubles = {};
      for (let set of lineup) {
        for (let gameNumber of set.gameNumbers) {
          if (
            gameNumber < data.gameNumbers[0] ||
            gameNumber > data.gameNumbers[data.gameNumbers.length - 1]
          ) {
            if (
              set.type === data.type &&
              sets[gameNumber] &&
              sets[gameNumber][`${team}Player1`]
            ) {
              const key1 = sets[gameNumber][`${team}Player1`].id;
              const key2 = sets[gameNumber][`${team}Player2`]
                ? sets[gameNumber][`${team}Player2`].id
                : null;
              let doubleKey = null;
              const maxCount = !key2
                ? modus.validator.maxCountSingles
                : modus.validator.maxCountDoubles;
              if (!count[key1]) {
                count[key1] = 0;
              }
              count[key1] += 1;
              if (key2) {
                if (!count[key2]) {
                  count[key2] = 0;
                }
                count[key2] += 1;
                doubleKey = playedDoubles[`${key1}${key2}`]
                  ? `${key1}${key2}`
                  : `${key2}${key1}`;
                if (!playedDoubles[doubleKey]) {
                  playedDoubles[doubleKey] = 0;
                }
                playedDoubles[doubleKey] += 1;
              }
              if (count[key1] >= maxCount) {
                disabled.push(key1);
              }
              if (key2 && count[key2] >= maxCount) {
                disabled.push(key2);
              }
              if (
                key2 &&
                selectedPlayer &&
                doubleKey &&
                modus.validator.equalDoubles > 0 &&
                playedDoubles[doubleKey] >= modus.validator.equalDoubles
              ) {
                disabled.push(doubleKey.replace(selectedPlayer, ''));
              }
            }
          }
        }
      }
    }

    return disabled;
  };

  render() {
    const { player } = this.props;

    return (
      <Container
        dataSource={player}
        renderRow={this.renderItem}
        ItemSeparatorComponent={() => <Separator image />}
        keyExtractor={player => `${player.id}`}
      />
    );
  }

  renderItem({ item, index }) {
    const disabled = this.state.disabled.indexOf(item.id) !== -1;
    return (
      <ListItem
        onPress={() => {
          this.onPress(index);
        }}
        disabled={disabled}
      >
        <ListItem.Image url={item.image} />
        <Text>{`${item.name} ${item.surname}`}</Text>
        <View style={{ flex: 1 }} />
        <ListItem.Icon
          right
          size={24}
          name={
            this.state.selected.indexOf(index) !== -1
              ? 'checkbox'
              : 'square-outline'
          }
        />
      </ListItem>
    );
  }

  onPress(idx) {
    const { state } = this.props.navigation;
    const { navigate, setPlayer, player, closeModal } = this.props;
    const { selected } = this.state;

    const index = selected.indexOf(idx);
    let playerId = null;
    if (index !== -1) {
      selected.splice(index, 1);
    } else {
      selected.push(idx);
      playerId = player[idx] ? player[idx].id : null;
    }
    const disabled = this.validate(playerId);

    this.setState({ selected, disabled }, () => {
      const selectionLength = selected.length;
      if (selectionLength === (state.params.data.type === 'DOUBLES' ? 2 : 1)) {
        const result = [];
        for (let itemIdx of selected) {
          result.push(player[itemIdx]);
        }
        setPlayer(state.params.data.gameNumbers, result);
        // wait animation done
        setTimeout(() => {
          if (state.params.team === 'home') {
            navigate({
              routeName: 'SelectPlayerView',
              params: {
                ...state.params,
                team: 'away',
                title: `${state.params.data.name} ${S.AWAY}`,
              },
            });
          } else {
            closeModal();
          }
        }, 10);
      }
    });
  }
}

SelectPlayer.navigationOptions = NavCloseIcon(null, hidePlayer());

export default StackNavigator(
  {
    SelectPlayerView: {
      screen: connect(
        (state, props) => ({
          player: getFixturePlayerList(
            state,
            getNavigationStateParams(props.navigation).matchId,
            getNavigationStateParams(props.navigation).team,
          ),
          modus: getFixtureModus(
            state,
            getNavigationStateParams(props.navigation).matchId,
          ),
          sets: getFixtureGames(
            state,
            getNavigationStateParams(props.navigation).matchId,
          ),
        }),
        (dispatch, props) => ({
          navigate: route => dispatch(navigate(route)),
          closeModal: () => dispatch(hidePlayer()),
          setPlayer: (gameNumbers, player) =>
            dispatch(
              getNavigationStateParams(props.navigation).team === 'home'
                ? setFixtureGameHomePlayer(
                    getNavigationStateParams(props.navigation).matchId,
                    gameNumbers,
                    player,
                  )
                : setFixtureGameAwayPlayer(
                    getNavigationStateParams(props.navigation).matchId,
                    gameNumbers,
                    player,
                  ),
            ),
          updateSets: (matchId, sets) =>
            dispatch(MatchActions.update({ id: matchId, sets })),
        }),
      )(SelectPlayer),
    },
  },
  {
    ...NavHeader,
  },
);
