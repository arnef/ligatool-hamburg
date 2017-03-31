import { TabNavigator, TabView } from 'react-navigation'
import Overview from './views/OverviewNavigator'
import MyTeam from './views/MyTeamNavigator'
import Leagues from './views/LeaguesView'
import Settings from './views/Settings/SettingsView'

export default TabNavigator({
    Overview: { screen: Overview },
    MyTeam: { screen: MyTeam },
    Leagues: { screen: Leagues },
    Settings: { screen: Settings }
}, {
    tabBarComponent: TabView.TabBarBottom,
    tabBarPosition: 'bottom',
    tabBarOptions: {
        activeTintColor: '#e91e63'
    },
    swipeEnabled: false,
    animationEnabled: false,
    lazyLoad: true
})