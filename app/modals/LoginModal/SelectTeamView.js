import React, { Component } from 'react';
import { Container, TeamLogo } from '../../components';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import { ListItem, Text, Separator } from '../../components/base';
import { NavigationActions } from 'react-navigation';

class SelectTeamView extends Component {
  componentDidMount() {
    const id = this.props.navigation.state.params.id;

    if (!this.props.leagues[id].table) {
      this.getTeams();
    }
  }

  render() {
    const lid = this.props.navigation.state.params.id;
    console.log(this.props.leagues[lid]);
    const teams = this.props.leagues[lid].table
      ? JSON.parse(JSON.stringify(this.props.leagues[lid].table))
      : [];

    // sort teams alphabetically
    teams.sort((a, b) => {
      return a.name < b.name ? -1 : 1;
    });

    return (
      <Container
        error={this.props.error}
        refreshing={this.props.fetching}
        onRefresh={this.getTeams.bind(this)}
        dataSource={teams}
        renderRow={this.renderItem.bind(this)}
        getItemLayout={(data, index) => ({
          length: ListItem.ITEM_HEIGHT,
          offset: ListItem.ITEM_HEIGHT * index,
          index,
        })}
        ItemSeparatorComponent={() => <Separator image />}
        keyExtractor={item => item.id}
      />
    );
  }

  renderItem({ item }) {
    return (
      <ListItem onPress={() => this.onPress(item)}>
        <TeamLogo team={item} />
        <Text>{`${item.name}`}</Text>
      </ListItem>
    );
  }

  getTeams() {
    const lid = this.props.navigation.state.params.id;
    this.props.getLeague(lid);
  }

  onPress(team) {
    this.props.setUserTeam(team);
    this.props.navigate({
      routeName: 'LoginView',
    });
  }
}


export default connect(
  state => ({
    error: state.loading.error,
    fetching: state.loading.nonBlocking,
    leagues: state.leagues,
  }),
  dispatch => ({
    getLeague: id => dispatch(actions.getLeague(id)),
    setUserTeam: team => dispatch(actions.setUserTeam(team)),
    navigate: route => dispatch(NavigationActions.navigate(route)),
  }),
)(SelectTeamView);
