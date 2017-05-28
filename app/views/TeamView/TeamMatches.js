// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { getTeamMatches } from '../../store/actions/teamActions';
import MatchListView from '../MatchListView';

class TeamView extends Component {
  render() {
    const { state } = this.props.navigation;
    const matches = this.props.teams[`${state.params.team.id}`]
      ? this.props.teams[`${state.params.team.id}`].matches
      : [];
    const props = {
      error: this.props.error,
      onRefresh: () => this.props.getTeamMatches(state.params.team.id),
      refreshing: this.props.fetching,
    };

    return <MatchListView {...props} refreshOnMount matches={matches || []} />;
  }
}

export default connect(
  state => ({
    teams: state.teams,
    error: state.loading.error,
    fetching: state.loading.nonBlocking,
  }),
  (dispatch: Dispatch<*>) => ({
    getTeamMatches: id => dispatch(getTeamMatches(id)),
  }),
)(TeamView);
