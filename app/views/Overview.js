/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import MatchListView from './MatchListView';
// import actions from '../store/actions';
import NavTabBarTop from '../Nav/NavTabBarTop';
import { TabNavigator } from 'react-navigation';
import strings from '../Strings';
import {
  TAB_MATCHES_TODAY,
  TAB_MATCHES_NEXT,
  TAB_MATCHES_PLAYED,
} from './routes';
import * as OverviewActions from '../redux/modules/overview';
// import * as OverviewActions from '../redux/modules/overview';

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
      // queryMatches: () => dispatch({ type: 'IGNORE' }),
    }),
  )(Overview);
}

export default TabNavigator(
  {
    [TAB_MATCHES_TODAY]: {
      screen: createTab('today'),
      navigationOptions: { title: strings.today },
    },
    [TAB_MATCHES_NEXT]: {
      screen: createTab('next'),
      navigationOptions: { title: strings.next },
    },
    [TAB_MATCHES_PLAYED]: {
      screen: createTab('played'),
      navigationOptions: { title: strings.played },
    },
  },
  {
    ...NavTabBarTop,
    lazy: false,
  },
);
