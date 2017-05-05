// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TabNavigator } from 'react-navigation';
import MatchListView from './MatchListView';
import NavTabBarTop from '../Nav/NavTabBarTop';
import { queryTeamMatches } from '../store/actions/teamActions';
import strings from '../Strings';
import { TAB_MATCHES_NEXT, TAB_MATCHES_PLAYED } from './routes';

class MyTeam extends Component {
  render() {
    const { matches, error, fetching, refreshOnMount } = this.props;

    return (
      <MatchListView
        error={error}
        matches={matches}
        refreshing={fetching}
        onRefresh={() => this.props.dispatch(queryTeamMatches())}
        refreshOnMount={refreshOnMount}
      />
    );
  }
}

export default TabNavigator(
  {
    [TAB_MATCHES_NEXT]: {
      screen: connect(state => ({
        matches: state.myTeam.next,
        fetching: state.loading.nonBlocking,
        error: state.loading.error,
        refreshOnMount: true
      }))(MyTeam),
      navigationOptions: { title: strings.next }
    },
    [TAB_MATCHES_PLAYED]: {
      screen: connect(state => ({
        matches: state.myTeam.played,
        fetching: state.loading.nonBlocking,
        error: state.loading.error,
        refreshOnMount: false
      }))(MyTeam),
      navigationOptions: { title: strings.played }
    }
  },
  {
    ...NavTabBarTop,
    lazyLoad: false
  }
);
