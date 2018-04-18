import React, { Component } from 'react';
import { sortBy } from 'lodash';
import { TeamLogo, ListItem, Text, Separator, Content } from '../../components';
import { connect } from 'react-redux';
import * as LeaguesActions from '../../redux/modules/leagues';
import {
  navigate,
  getNavigationStateParams,
} from '../../redux/modules/navigation';

class SelectTeamView extends Component {
  render() {
    const { teams } = this.props;

    return (
      <Content
        renderItem={this.renderItem}
        renderSeparator={() => <Separator image />}
        data={teams}
      />
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
  (state, props) => ({
    error: state.loading.error,
    fetching: state.loading.list,
    teams: sortBy(
      state.drawer[getNavigationStateParams(props.navigation).id]
        ? state.drawer[getNavigationStateParams(props.navigation).id].teams
        : [],
      'name',
    ),
  }),
  dispatch => ({
    getLeague: id => dispatch(LeaguesActions.getLeague(id)),
    setUserTeam: team =>
      dispatch({ type: 'SELECT_USER_TEAM', payload: { id: team.id } }),
    navigate: route => dispatch(navigate(route)),
  }),
)(SelectTeamView);
