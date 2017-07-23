import React from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as LeaguesActions from '../../redux/modules/leagues';
import { Container, ListItem, Text, Separator } from '../../components';

class SelectGroupView extends React.Component {
  componentDidMount() {
    if (this.props.leagues.length === 0) {
      this.props.getRankings();
    }
  }

  render() {
    return (
      <Container
        error={this.props.error}
        refreshing={this.props.fetching}
        onRefresh={this.props.getRankings.bind(this)}
        renderRow={this.renderItem.bind(this)}
        dataSource={this.props.leagues}
        ItemSeparatorComponent={Separator}
        getItemLayout={(data, index) => ({
          length: ListItem.ITEM_HEIGHT,
          offset: ListItem.ITEM_HEIGHT * index,
          index,
        })}
        keyExtractor={item => item.id}
      />
    );
  }

  renderItem({ item }) {
    return (
      <ListItem onPress={() => this.onPress(item)}>
        <Text>{`${item.name}`}</Text>
      </ListItem>
    );
  }

  onPress(league) {
    const { state } = this.props.navigation;
    this.props.navigate({
      routeName: 'SelectTeam',
      params: {
        id: league.id,
        next: state.params && state.params.next ? state.params.next : null,
      },
    });
  }
}

export default connect(
  state => ({
    error: state.loading.error,
    fetching: state.loading.list,
    leagues: _.filter(Object.values(state.drawer), o => {
      return !o.cup;
    }),
  }),
  dispatch => ({
    getRankings: () => dispatch(LeaguesActions.getLeagues()),
    navigate: route => dispatch(NavigationActions.navigate(route)),
  }),
)(SelectGroupView);
