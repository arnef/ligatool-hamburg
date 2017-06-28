import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../store/actions';
import { Container } from '../components';
import { ListItem, Text, Separator } from '../components/base';
import { NavigationActions } from 'react-navigation';
import { LEAGUE, LEAGUE_CUP } from './routes';

class LeaguesView extends Component {
  componentDidMount() {
    const { leagues } = this.props;

    if (Object.keys(leagues).length === 0) {
      this.props.getRankings();
    }
  }

  renderItem({ item }) {
    return (
      <ListItem onPress={() => this.onPress(item)}>
        <Text>
          {item.name}
        </Text>
      </ListItem>
    );
  }

  render() {
    return (
      <Container
        error={this.props.error}
        refreshing={this.props.loading}
        onRefresh={this.props.getRankings.bind(this)}
        keyExtractor={item => item.id}
        renderRow={this.renderItem.bind(this)}
        dataSource={this.props.leagues}
        getItemLayout={(data, index) => ({
          length: ListItem.ITEM_HEIGHT,
          offset: ListItem.ITEM_HEIGHT * index,
          index,
        })}
        ItemSeparatorComponent={Separator}
      />
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
          cup: league.cup ? league.name : undefined,
        },
      }),
    );
  }
}

export default connect(
  state => ({
    leagues: Object.values(state.leagues).sort(
      (a, b) => (a.name < b.name ? -1 : 1),
    ),
    loading: state.loading.nonBlocking,
    error: state.loading.error,
  }),
  dispatch => ({
    getRankings: () => dispatch(actions.getRankings()),
    pushRoute: route => dispatch(actions.pushRoute(route)),
    dispatch: action => dispatch(action),
  }),
)(LeaguesView);
