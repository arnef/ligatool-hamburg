import React, { Component, PropTypes } from 'react'
import TeamDetails from '../TeamView/TeamDetails'
import NavTabBarTop from '../../Nav/NavTabBarTop'
import { TabNavigator } from 'react-navigation'

class TeamHome extends Component {

    render() {
        return (
            <TeamDetails navigation={ this.props.navigation } teamKey='home' />
        )
    }
}

class TeamAway extends Component {

    render() {
        return (
            <TeamDetails navigation={ this.props.navigation } teamKey='away' />
        )
    }
}


TeamHome.navigationOptions = {
    title: ({ state }) => state.params.match.team_home.name,
    tabBar: {
        label: 'Heim'
    }
}
TeamAway.navigationOptions = {
    title: ({ state }) => state.params.match.team_away.name,
    tabBar: {
        label: 'Gast'
    }
}
export default TabNavigator({
    TeamHome: { screen: TeamHome },
    TeamAway: { screen: TeamAway }
}, {
    tabBarComponent: NavTabBarTop,
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    lazyload: true
})
