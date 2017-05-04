import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import { hidePlayerDialog } from '../store/actions/dialogActions';
import { setPlayer, updateSets } from '../store/actions/matchActions';
import { Container } from '../components';
import { ListItem, Text } from '../components/base';
import NavHeader from '../Nav/NavHeader';
import NavCloseIcon from '../Nav/NavCloseIcon';

class SelectPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {}
    };
  }

  render() {
    const { matches } = this.props;
    const { state } = this.props.navigation;
    const match = matches[state.params.matchId];
    const teamKey = `team_${state.params.team}`;
    const items = match[teamKey] ? match[teamKey].player : [];

    return (
      <Container>
        <ListItem.Group>
          {items.map((item, idx) => {
            return this.renderItem(item, idx, items.length - 1);
          })}
        </ListItem.Group>
      </Container>
    );
  }

  renderItem(data, idx, length) {
    const { selected } = this.state;

    return (
      <ListItem
        key={data.id}
        icon
        last={idx === length}
        onPress={() => this.onPress(idx)}
      >
        <ListItem.Image url={data.image} />
        <Text>{`${data.name} ${data.surname}`}</Text>
        <View style={{ flex: 1 }} />
        <ListItem.Icon
          right
          name={selected[idx] ? 'checkbox' : 'square-outline'}
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

    console.tron.log(`items selected ${selectionLength}`);
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
        state.params.data.setsIdx
      );
      // wait animation done
      setTimeout(() => {
        if (state.params.team === 'home') {
          navigate({
            routeName: 'SelectPlayerView',
            params: { ...state.params, team: 'away' }
          });
        } else {
          closeModal();
          const set = state.params.data.sets[0];

          if (set.goals_home != null && set.goals_away != null) {
            const sets = matches[state.params.matchId].sets;

            this.props.updateSets(state.params.matchId, sets);
          }
        }
      }, 10);
    } else if (selectionLength > state.params.data.type) {
      this.setState({
        selected: { [idx]: true }
      });
    }
  }
}

SelectPlayer.navigationOptions = {
  title: ({ state }) => {
    const team = state.params.team === 'home' ? 'Heim' : 'Gast';

    return `${state.params.data.name} ${team}`;
  },
  header: (navigation, defaulHeader) => {
    // maybe check this in NavCloseIcon
    if (navigation.state.key === 'Init') {
      return NavCloseIcon(navigation, defaulHeader);
    } else {
      return defaulHeader;
    }
  }
};

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
          updateSets: (matchId, sets) => dispatch(updateSets(matchId, sets))
        })
      )(SelectPlayer)
    }
  },
  {
    ...NavHeader
  }
);
