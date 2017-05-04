/* @flow */
import React, { Component } from 'react';
import { FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import MatchListView from './MatchListView';
import actions from '../store/actions';
import NavDrawerIcon from '../Nav/NavDrawerIcon';
import NavTabBarTop from '../Nav/NavTabBarTop';
import { TabNavigator } from 'react-navigation';
import strings from '../Strings';
import {
  TAB_MATCHES_TODAY,
  TAB_MATCHES_NEXT,
  TAB_MATCHES_PLAYED
} from './routes';

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
      error: state.loading.error,
      fetching: state.loading.nonBlocking,
      refreshOnMount: keyName === 'today'
    }),
    dispatch => ({ queryMatches: () => dispatch(actions.queryMatches()) })
  )(Overview);
}

export default TabNavigator(
  {
    [TAB_MATCHES_TODAY]: {
      screen: createTab('today'),
      navigationOptions: { title: strings.today }
    },
    [TAB_MATCHES_NEXT]: {
      screen: createTab('next'),
      navigationOptions: { title: strings.next }
    },
    [TAB_MATCHES_PLAYED]: {
      screen: createTab('played'),
      navigationOptions: { title: strings.played }
    }
  },
  {
    ...NavTabBarTop,
    lazyLoad: false
  }
);
