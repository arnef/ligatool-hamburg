// @flow
import React from 'react';
import { connect } from 'react-redux';
import { TabNavigator } from 'react-navigation';
import { MatchList, Team } from '../../components';
import NavTabBarTop from '../../Nav/NavTabBarTop';
import * as TeamsActions from '../../redux/modules/teams';
import Routes from '../../config/routes';
import S from '../../lib/strings';

const TeamMatches = connect(
  state => ({
    teams: state.teams,
  }),
  (dispatch: Dispatch<any>) => ({
    getMatches: id => dispatch(TeamsActions.getMatches(id)),
  }),
)(function Team(props) {
  const matches = props.teams[`${props.navigation.state.params.team.id}`]
    ? props.teams[`${props.navigation.state.params.team.id}`].matches
    : [];
  return (
    <MatchList
      matches={matches}
      onRefresh={() => props.getMatches(props.navigation.state.params.team.id)}
    />
  );
});

export default TabNavigator(
  {
    [Routes.TAB_TEAM]: {
      screen: Team,
      navigationOptions: { title: S.TEAM_INFO },
    },
    [Routes.TAB_MATCHES]: {
      screen: TeamMatches,
      navigationOptions: { title: S.MATCHES },
    },
  },
  {
    ...NavTabBarTop,
    tabBarOptions: { scrollEnabled: false },
  },
);
