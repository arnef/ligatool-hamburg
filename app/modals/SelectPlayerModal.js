// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import * as MatchActions from '../redux/modules/matches';

import * as NavigationActions from '../redux/modules/navigation';
import { Container, ListItem, Text, Separator } from '../components';
import NavHeader from '../Nav/NavHeader';
import NavCloseIcon from '../Nav/NavCloseIcon';

import S from '../lib/strings';

class SelectPlayer extends Component {
  state: { selected: { [string]: boolean } };
  onPress: Function;
  renderItem: Function;

  constructor(props: any) {
    super(props);
    this.state = {
      selected: {},
    };
    this.onPress = this.onPress.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  render() {
    const { matches } = this.props;
    const { state } = this.props.navigation;
    const match = matches[state.params.matchId];
    const teamKey = `team_${state.params.team}`;
    let items = match[teamKey] ? match[teamKey].player : [];

    return (
      <Container
        dataSource={items}
        renderRow={this.renderItem}
        ItemSeparatorComponent={() => <Separator image />}
        keyExtractor={item => `${item.id}`}
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
          name={this.state.selected[index] ? 'checkbox' : 'square-outline'}
        />
      </ListItem>
    );
  }

  onPress(idx) {
    const { state } = this.props.navigation;
    const { navigate, setPlayer, matches } = this.props;
    const { selected } = this.state;

    if (selected[idx]) {
      delete selected[idx];
    } else {
      selected[idx] = true;
    }
    this.setState({ selected });
    const selectionLength = Object.values(selected).length;

    if (selectionLength === state.params.data.type) {
      const result = [];
      const player =
        matches[state.params.matchId][`team_${state.params.team}`].player;

      for (let itemIdx in selected) {
        result.push(player[itemIdx]);
      }

      setPlayer(
        state.params.matchId,
        state.params.team,
        result,
        state.params.data.setsIdx,
      );
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
        }
      }, 10);
    } else if (selectionLength > state.params.data.type) {
      this.setState({
        selected: { [idx]: true },
      });
    }
  }
}

SelectPlayer.navigationOptions = NavCloseIcon(
  null,
  NavigationActions.hidePlayer(),
);

export default StackNavigator(
  {
    SelectPlayerView: {
      screen: connect(
        state => ({ matches: state.matches }),
        (dispatch: Dispatch<any>) => ({
          navigate: route => dispatch(NavigationActions.navigate(route)),
          closeModal: () => dispatch(NavigationActions.hidePlayer()),
          setPlayer: (id, team, player, setsIdx) =>
            dispatch(MatchActions.setPlayer({ id, team, player, setsIdx })),
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
