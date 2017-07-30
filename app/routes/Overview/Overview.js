/* @flow */
import React from 'react';
import { connect } from 'react-redux';
// import MatchListView from '../../views/MatchListView';
import NavTabBarTop from '../../Nav/NavTabBarTop';
import { TabNavigator } from 'react-navigation';
import S from '../../lib/strings';
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
      navigationOptions: { title: S.PAST_MATCHES },
    },
    [Routes.TAB_MATCHES_TODAY]: {
      screen: createTab('today'),
      navigationOptions: { title: S.TODAY },
    },
    [Routes.TAB_MATCHES_NEXT]: {
      screen: createTab('next'),
      navigationOptions: { title: S.NEXT_MATCHES },
    },
  },
  {
    ...NavTabBarTop,
    initialRouteName: Routes.TAB_MATCHES_TODAY,
    lazy: false,
  },
);
