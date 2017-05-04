// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TabNavigator } from 'react-navigation'
import MatchListView from './MatchListView'
import NavTabBarTop from '../Nav/NavTabBarTop'
import NavDrawerIcon from '../Nav/NavDrawerIcon'
import { queryTeamMatches } from '../store/actions/teamActions'
import strings from '../Strings'
import { TAB_MATCHES_NEXT, TAB_MATCHES_PLAYED } from './routes'

class MyTeam extends Component {

  render() {
    const { keyName, myTeam, loading } = this.props;

    const props = {
      error: null,
      refreshing: loading,
      matches: myTeam[keyName],
      onRefresh: () => { this.props.dispatch(queryTeamMatches())},
    }

    return (
      <MatchListView { ...props } refreshOnMount={keyName === 'next' && props.matches.length === 0} />
    )
  }
}


export default TabNavigator({
  [TAB_MATCHES_NEXT]: {
    screen: connect(state => ({ keyName: 'next', myTeam: state.myTeam, loading: state.loading.nonBlocking }))(MyTeam),
    navigationOptions: { title: strings.next }
  },
  [TAB_MATCHES_PLAYED]: {
    screen: connect(state => ({ keyName: 'played', myTeam: state.myTeam, loading: state.loading.nonBlocking }))(MyTeam),
    navigationOptions: { title: strings.played }
  }
}, {
  ...NavTabBarTop,
  lazyLoad: false
});
