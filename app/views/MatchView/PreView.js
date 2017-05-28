import React, { Component } from 'react';
import TeamDetails from '../TeamView/TeamDetails';
import NavTabBarTop from '../../Nav/NavTabBarTop';
import { TabNavigator } from 'react-navigation';
import { TAB_HOME, TAB_AWAY } from '../routes';

class TeamHome extends Component {
  render() {
    return <TeamDetails navigation={this.props.navigation} teamKey="home" />;
  }
}

class TeamAway extends Component {
  render() {
    return <TeamDetails navigation={this.props.navigation} teamKey="away" />;
  }
}

TeamHome.navigationOptions = ({ navigation }) => ({
  title: navigation.state.params.match.team_home.name,
  tabBarLabel: 'Heim',
});
TeamAway.navigationOptions = ({ navigation }) => ({
  title: navigation.state.params.match.team_away.name,
  tabBarLabel: 'Gast',
});
export default TabNavigator(
  {
    [TAB_HOME]: { screen: TeamHome },
    [TAB_AWAY]: { screen: TeamAway },
  },
  {
    ...NavTabBarTop,
    tabBarOptions: { scrollEnabled: false },
  },
);
