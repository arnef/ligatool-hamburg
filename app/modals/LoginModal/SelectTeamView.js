import React, { Component } from 'react';
import { sortBy } from 'lodash';
import {
  Container,
  TeamLogo,
  ListItem,
  Text,
  Separator,
} from '../../components';
import { connect } from 'react-redux';
import * as LeaguesActions from '../../redux/modules/leagues';
import * as SettingsActions from '../../redux/modules/settings';
import { NavigationActions } from 'react-navigation';

class SelectTeamView extends Component {
  componentDidMount() {
    const id = this.props.navigation.state.params.id;

    if (!this.props.leagues[id]) {
      this.getTeams();
    }
  }

  render() {
    const lid = this.props.navigation.state.params.id;
    const teams = sortBy(
      this.props.leagues[lid] ? this.props.leagues[lid].table : [],
      'name',
    );

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
      // params: { ...this.props.navigation.state.params },
    });
  }
}

export default connect(
  state => ({
    error: state.loading.error,
    fetching: state.loading.list,
    leagues: state.leagues,
  }),
  dispatch => ({
    getLeague: id => dispatch(LeaguesActions.getLeague(id)),
    setUserTeam: team => dispatch(SettingsActions.setTeam(team)),
    navigate: route => dispatch(NavigationActions.navigate(route)),
  }),
)(SelectTeamView);
