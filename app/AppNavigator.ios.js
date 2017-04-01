import { TabNavigator } from 'react-navigation'
import Overview from './views/OverviewNavigator'
import MyTeam from './views/MyTeamNavigator'
import Leagues from './views/LeaguesView'
import Settings from './views/Settings/SettingsView'
import NavTabBarBottom from './Nav/NavTabBarBottom'
import NavIcon from './Nav/NavIcon'

Overview.navigationOptions = {
    title: 'Übersicht',
    tabBar: {
        icon: ({ tintColor }) => NavIcon('football', tintColor)
    }
}
MyTeam.navigationOptions = {
    title: 'Mein Team',
    tabBar: {
        label: 'Mein Team',
        icon: ({ tintColor }) => NavIcon('shirt', tintColor)
    }
}
Leagues.navigationOptions = {
    title: 'Gruppen',
    tabBar: {
        icon: ({ tintColor }) => NavIcon('trophy', tintColor)
    }
}
Settings.navigationOptions = {
    title: 'Einstellungen',
    tabBar: {
        icon: ({ tintColor }) => NavIcon('settings', tintColor)
    }
}

export default TabNavigator({
    Overview: { screen: Overview },
    MyTeam: { screen: MyTeam },
    Leagues: { screen: Leagues },
    Settings: { screen: Settings }
}, {
    tabBarComponent: NavTabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    lazyLoad: true
})