import { DrawerNavigator } from 'react-navigation'
import Overview from './views/OverviewNavigator'
import MyTeam from './views/MyTeamNavigator'
import Leagues from './views/LeaguesView'
import Settings from './views/Settings/SettingsView'

export default DrawerNavigator({
    Overview: { screen: Overview },
    MyTeam: { screen: MyTeam },
    Leagues: { screen: Leagues },
    Settings: { screen: Settings }
})