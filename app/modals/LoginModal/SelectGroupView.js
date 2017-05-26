import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getRankings } from '../../store/actions/leagueActions';
import { Container } from '../../components';
import { ListItem, Text, Separator } from '../../components/base';
import { NavigationActions } from 'react-navigation';
import NavCloseIcon from '../../Nav/NavCloseIcon';

class SelectGroupView extends Component {
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
    this.props.navigate({
      routeName: 'SelectTeam',
      params: { id: league.id },
    });
  }
}


export default connect(
  state => ({
    error: state.loading.error,
    fetching: state.loading.nonBlocking,
    leagues: Object.values(state.leagues),
  }),
  dispatch => ({
    getRankings: () => dispatch(getRankings()),
    navigate: route => dispatch(NavigationActions.navigate(route)),
  }),
)(SelectGroupView);
