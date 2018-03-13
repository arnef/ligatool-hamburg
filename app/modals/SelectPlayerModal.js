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
} from '../redux/modules/fixtures';

class SelectPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
    };
    this.onPress = this.onPress.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

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
    const { state } = this.props.navigation;
    const disabled = item.disabled
      ? state.params.data.type === 1
        ? item.disabled.singles
        : item.disabled.doubles
      : false;
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
    if (index !== -1) {
      selected.splice(index, 1);
    } else {
      selected.push(idx);
    }
    this.setState({ selected });
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
