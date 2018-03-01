import React from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { filter, sortBy } from 'lodash';
import * as LeaguesActions from '../../redux/modules/leagues';
import { Container, ListItem, Text, Separator } from '../../components';

class SelectGroupView extends React.Component {
  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
  }
  render() {
    return (
      <Container
        error={this.props.error}
        refreshing={this.props.fetching}
        onRefresh={this.props.getRankings}
        renderRow={this.renderItem}
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
    this.props.navigate({
      routeName: 'SelectTeam',
      params: {
        id: league.id,
      },
    });
  }
}

export default connect(
  state => ({
    error: state.loading.error,
    fetching: state.loading.list,
    leagues: sortBy(state.drawer, 'name'),
  }),
  dispatch => ({
    getRankings: () => dispatch(LeaguesActions.getLeagues()),
    navigate: route => dispatch(NavigationActions.navigate(route)),
  }),
)(SelectGroupView);
