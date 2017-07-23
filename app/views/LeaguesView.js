import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, ListItem, Text, Separator } from '../components';
import { NavigationActions } from 'react-navigation';
import Routes from '../config/routes';
import * as LeagueActions from '../redux/modules/leagues';

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
        routeName: league.cup ? Routes.LEAGUE_CUP : Routes.LEAGUE,
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
    leagues: Object.values(state.drawer).sort(
      (a, b) => (a.name < b.name ? -1 : 1),
    ),
    loading: state.loading.list,
    error: null, //state.loading.error,
  }),
  dispatch => ({
    getRankings: () => dispatch(LeagueActions.getLeagues()),
    pushRoute: route => dispatch(NavigationActions.navigate(route)),
    dispatch: action => dispatch(action),
  }),
)(LeaguesView);
