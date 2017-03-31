import { DrawerNavigator, TabView } from 'react-navigation'
import Overview from './views/Overview'
import MyTeam from './views/MyTeamView'
import Leagues from './views/LeaguesView'
import Settings from './views/Settings/SettingsView'

export default DrawerNavigator({
    Overview: { screen: Overview },
    MyTeam: { screen: MyTeam },
    Leagues: { screen: Leagues },
    Settings: { screen: Settings }
}
// {
//     tabBarComponent: TabView.TabBarBottom,
//     tabBarPosition: 'bottom',
//     tabBarOptions: {
//         activeTintColor: '#e91e63'
// }
)