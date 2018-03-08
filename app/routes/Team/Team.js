import React from 'react';
import { connect } from 'react-redux';
import { TabNavigator } from 'react-navigation';
import { MatchList, Team } from '../../components';
import NavTabBarTop from '../../Nav/NavTabBarTop';
import * as TeamsActions from '../../redux/modules/teams';
import Routes from '../../config/routes';
import S from '../../lib/strings';
import { getFixtureByTeam } from '../../redux/modules/fixtures';

const TeamMatches = connect(
  (state, props) => ({
    teams: state.teams,
    fixtures: getFixtureByTeam(
      state,
      props.navigation.state.params.team.groupId ||
        props.navigation.state.params.team.id,
    ),
  }),
  dispatch => ({
    getMatches: id => dispatch(TeamsActions.getMatches(id)),
  }),
)(function Team(props) {
  return (
    <MatchList
      matches={props.fixtures}
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
