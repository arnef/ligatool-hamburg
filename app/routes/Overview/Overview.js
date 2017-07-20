/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import MatchListView from '../../views/MatchListView';
import NavTabBarTop from '../../Nav/NavTabBarTop';
import { TabNavigator } from 'react-navigation';
import strings from '../../lib/strings';
import Routes from '../../config/routes';
import * as OverviewActions from '../../redux/modules/overview';

class Overview extends Component {
  onRefresh() {
    this.props.queryMatches();
  }

  render() {
    const { matches, refreshOnMount, error, fetching } = this.props;

    return (
      <MatchListView
        error={error}
        refreshing={fetching}
        matches={matches}
        onRefresh={this.onRefresh.bind(this)}
        refreshOnMount={refreshOnMount}
      />
    );
  }
}

function createTab(keyName) {
  return connect(
    state => ({
      matches: state.overview[keyName],
      error: null, //state.loading.error,
      fetching: state.loading.list,
      refreshOnMount: keyName === 'played',
    }),
    (dispatch: Dispatch<*>) => ({
      queryMatches: () => dispatch(OverviewActions.getMatches()),
    }),
  )(Overview);
}

export default TabNavigator(
  {
    [Routes.TAB_MATCHES_PLAYED]: {
      screen: createTab('played'),
      navigationOptions: { title: strings.played },
    },
    [Routes.TAB_MATCHES_TODAY]: {
      screen: createTab('today'),
      navigationOptions: { title: strings.today },
    },
    [Routes.TAB_MATCHES_NEXT]: {
      screen: createTab('next'),
      navigationOptions: { title: strings.next },
    },
  },
  {
    ...NavTabBarTop,
    // initialRouteName: Routes.TAB_MATCHES_TODAY,
    lazy: false,
  },
);
