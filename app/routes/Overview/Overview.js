/* @flow */
import React from 'react';
import { connect } from 'react-redux';
// import MatchListView from '../../views/MatchListView';
import NavTabBarTop from '../../Nav/NavTabBarTop';
import { TabNavigator } from 'react-navigation';
import strings from '../../lib/strings';
import Routes from '../../config/routes';
import { MatchList } from '../../components';
import * as OverviewActions from '../../redux/modules/overview';

class Overview extends React.Component {
  render() {
    const { matches } = this.props;

    return <MatchList matches={matches} onRefresh={this.props.queryMatches} />;
  }
}

function createTab(keyName) {
  return connect(
    state => ({
      matches: state.overview[keyName],
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
    initialRouteName: __DEV__
      ? Routes.TAB_MATCHES_PLAYED
      : Routes.TAB_MATCHES_TODAY,
    lazy: false,
  },
);
