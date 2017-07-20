// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TabNavigator } from 'react-navigation';
import MatchListView from './MatchListView';
import NavTabBarTop from '../Nav/NavTabBarTop';
import * as MyTeamActions from '../redux/modules/myteam';
import Routes from '../config/routes';
import strings from '../lib/strings';

class MyTeam extends Component {
  render() {
    const { matches, error, fetching, refreshOnMount } = this.props;

    return (
      <MatchListView
        error={error}
        matches={matches}
        refreshing={fetching}
        onRefresh={() => this.props.dispatch(MyTeamActions.getMatches())}
        refreshOnMount={refreshOnMount}
      />
    );
  }
}

export default TabNavigator(
  {
    [Routes.TAB_MATCHES_NEXT]: {
      screen: connect(state => ({
        matches: state.myTeam.next,
        fetching: state.loading.list,
        error: null, // state.loading.error,
        refreshOnMount: true,
      }))(MyTeam),
      navigationOptions: { title: strings.next },
    },
    [Routes.TAB_MATCHES_PLAYED]: {
      screen: connect(state => ({
        matches: state.myTeam.played,
        fetching: state.loading.list,
        error: null, //state.loading.error,
        refreshOnMount: false,
        // team: state.settings.team,
      }))(MyTeam),
      navigationOptions: { title: strings.played },
    },
  },
  {
    ...NavTabBarTop,
    lazyLoad: false,
    tabBarOptions: { scrollEnabled: false },
  },
);
