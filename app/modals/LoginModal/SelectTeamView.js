import React, { Component } from 'react';
import { View } from 'react-native';
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
      this.props.leagues[lid] ? this.props.leagues[lid].teams : [],
      'name',
    );

    return (
      <View style={{ flex: 1 }}>
        <Container
          error={this.props.error}
          refreshing={this.props.fetching}
          onRefresh={this.getTeams}
          dataSource={teams}
          renderRow={this.renderItem}
          getItemLayout={(data, index) => ({
            length: ListItem.ITEM_HEIGHT,
            offset: ListItem.ITEM_HEIGHT * index,
            index,
          })}
          ItemSeparatorComponent={() => <Separator image />}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }

  renderItem = ({ item }) => {
    return (
      <ListItem onPress={() => this.onPress(item)}>
        <TeamLogo team={item.emblemUrl} />
        <Text>{`${item.name}`}</Text>
      </ListItem>
    );
  };

  onPress = team => {
    this.props.setUserTeam(team);
  };
}

export default connect(
  state => ({
    error: state.loading.error,
    fetching: state.loading.list,
    leagues: state.drawer,
  }),
  dispatch => ({
    getLeague: id => dispatch(LeaguesActions.getLeague(id)),
    setUserTeam: team =>
      dispatch({ type: 'SELECT_USER_TEAM', payload: { id: team.id } }),
    navigate: route => dispatch(NavigationActions.navigate(route)),
  }),
)(SelectTeamView);
