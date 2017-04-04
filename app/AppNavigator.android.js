import { DrawerNavigator } from 'react-navigation'
import Drawer from './views/DrawerView'
import Overview from './views/OverviewNavigator'
import Settings from './views/Settings/SettingsView'
import MyTeam from './views/MyTeamNavigator'
import Leagues from './views/LeaguesView'

const drawerWidth = 260


export default DrawerNavigator({
    Overview: { screen: Overview },
    MyTeam: { screen: MyTeam },
    Settings: { screen: Settings },
    Leagues: { screen: Leagues }
}, {
    contentComponent: Drawer,
    drawerWidth
})