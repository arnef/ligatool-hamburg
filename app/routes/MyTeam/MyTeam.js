// @flow
import React from 'react';
import { connect } from 'react-redux';
import { TabNavigator } from 'react-navigation';
import NavTabBarTop from '../../Nav/NavTabBarTop';
import { MatchList, Team } from '../../components';
import * as MyTeamActions from '../../redux/modules/myteam';
import Routes from '../../config/routes';
import S from '../../lib/strings';

function MyTeam(props) {
  return <MatchList matches={props.matches} onRefresh={props.getMatches} />;
}

const NextMatches = connect(
  state => ({
    matches: state.myTeam.next,
  }),
  (dispatch: Dispatch<any>) => ({
    getMatches: () => dispatch(MyTeamActions.getMatches()),
  }),
)(MyTeam);
const PlayedMatches = connect(
  state => ({
    matches: state.myTeam.played,
  }),
  (dispatch: Dispatch<any>) => ({
    getMatches: () => dispatch(MyTeamActions.getMatches()),
  }),
)(MyTeam);

export default TabNavigator(
  {
    [Routes.TAB_MATCHES_PLAYED]: {
      screen: PlayedMatches,
      navigationOptions: { title: S.PAST_MATCHES },
    },
    [Routes.TAB_MATCHES_NEXT]: {
      screen: NextMatches,
      navigationOptions: { title: S.NEXT_MATCHES },
    },
    [Routes.TAB_MY_TEAM_INFO]: {
      screen: Team,
      navigationOptions: { title: S.TEAM_INFO },
    },
  },
  {
    ...NavTabBarTop,
    lazyLoad: false,
    initialRouteName: Routes.TAB_MATCHES_NEXT,
  },
);
