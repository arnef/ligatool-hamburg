import React, { Component } from 'react';
import { View } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import { hidePlayerDialog } from '../store/actions/dialogActions';
import { setPlayer, updateSets } from '../store/actions/matchActions';
import { Container } from '../components';
import { ListItem, Text, Separator } from '../components/base';
import NavHeader from '../Nav/NavHeader';
import NavCloseIcon from '../Nav/NavCloseIcon';

class SelectPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {},
    };
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
        renderRow={this.renderItem.bind(this)}
        ItemSeparatorComponent={() => <Separator image />}
        keyExtractor={item => item.id}
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
      <ListItem onPress={() => this.onPress(index)} disabled={disabled}>
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
    const { navigate, closeModal, setPlayer, matches } = this.props;
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
            params: { ...state.params,
              team: 'away',
              title: `${state.params.data.name} Gast`
            },
          });
        } else {
          closeModal();
          const set = state.params.data.sets[0];
          const match = matches[state.params.matchId];
          console.tron.log(set);
          console.tron.log(match.lineUp);
          if (
            (set.goals_home != null && set.goals_away != null) ||
            (match.lineUp && match.lineUp.update)
          ) {
            this.props.updateSets(state.params.matchId, match.sets);
          }
        }
      }, 10);
    } else if (selectionLength > state.params.data.type) {
      this.setState({
        selected: { [idx]: true },
      });
    }
  }
}

SelectPlayer.navigationOptions = NavCloseIcon();

export default StackNavigator(
  {
    SelectPlayerView: {
      screen: connect(
        state => ({ matches: state.matches }),
        dispatch => ({
          navigate: route => dispatch(NavigationActions.navigate(route)),
          closeModal: () => dispatch(hidePlayerDialog()),
          setPlayer: (id, team, player, setsIdx) =>
            dispatch(setPlayer(id, team, player, setsIdx)),
          updateSets: (matchId, sets) => dispatch(updateSets(matchId, sets)),
        }),
      )(SelectPlayer),
    },
  },
  {
    ...NavHeader,
  },
);
