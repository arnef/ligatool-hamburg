import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../store/actions';
import { View } from 'react-native';
import { Container } from '../components';
import { ListItem, Text } from '../components/base';
import { NavigationActions } from 'react-navigation';
import {
  LEAGUE,
  LEAGUE_CUP
} from './routes';

class LeaguesView extends Component {
  componentDidMount() {
    const { leagues } = this.props;

    if (Object.keys(leagues).length === 0) {
      this.props.getRankings();
    }
  }

  render() {
    const leagues = Object.values(this.props.leagues);
    leagues.sort((a, b) => (a.name < b.name ? -1 : 1));
    return (
      <Container
        error={null}
        refreshing={this.props.loading}
        onRefresh={this.props.getRankings.bind(this)}
      >
        {leagues.length > 0 &&
          <ListItem.Group>
            {leagues.map((league, idx) => {
              return (
                <View key={league.id}>
                  <ListItem
                    last={idx === leagues.length - 1}
                    onPress={() => this.onPress(league)}
                  >
                    <Text>{league.name}</Text>
                  </ListItem>
                </View>
              );
            })}
          </ListItem.Group>}
      </Container>
    );
  }

  onPress(league) {
    const { dispatch } = this.props;

    dispatch(
      NavigationActions.navigate({
        routeName: league.cup ? LEAGUE_CUP : LEAGUE,
        params: {
          id: league.id,
          title: league.name,
          cup: league.cup ? league.name : undefined
        }
      })
    );
  }
}

export default connect(
  state => ({
    leagues: state.leagues,
    loading: state.loading.nonBlocking
  }),
  dispatch => ({
    getRankings: () => dispatch(actions.getRankings()),
    pushRoute: route => dispatch(actions.pushRoute(route)),
    dispatch: action => dispatch(action)
  })
)(LeaguesView);
