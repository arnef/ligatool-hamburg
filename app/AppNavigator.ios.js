/* @flow */
import { TabNavigator } from 'react-navigation'
import Overview from './views/OverviewNavigator'
import MyTeam from './views/MyTeamNavigator'
import Leagues from './views/LeaguesView'
import Settings from './views/Settings/SettingsView'
import NavTabBarBottom from './Nav/NavTabBarBottom'
import NavIcon from './Nav/NavIcon'

import {
  OVERVIEW_NAVIGATOR,
  MY_TEAM_NAVIGATOR,
  LEAGUES_NAVIGATOR,
  SETTINGS_NAVIGATOR
} from './views/routes'
import strings from './Strings'

Overview.navigationOptions = {
    title: strings.overview,
    tabBar: {
        icon: ({ tintColor }) => NavIcon('football', tintColor)
    }
}
MyTeam.navigationOptions = {
    title: strings.my_team,
    tabBar: {
        icon: ({ tintColor }) => NavIcon('shirt', tintColor)
    }
}
Leagues.navigationOptions = {
    title: strings.leagues,
    tabBar: {
        icon: ({ tintColor }) => NavIcon('trophy', tintColor)
    }
}
Settings.navigationOptions = {
    title: strings.settings,
    tabBar: {
        icon: ({ tintColor }) => NavIcon('settings', tintColor)
    }
}

export default TabNavigator({
    [OVERVIEW_NAVIGATOR]: { screen: Overview },
    [MY_TEAM_NAVIGATOR]: { screen: MyTeam },
    [LEAGUES_NAVIGATOR]: { screen: Leagues },
    [SETTINGS_NAVIGATOR]: { screen: Settings }
}, {
    tabBarComponent: NavTabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    lazyLoad: true
})
