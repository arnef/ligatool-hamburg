import { DrawerNavigator } from 'react-navigation'
import Drawer from './views/DrawerView'
import Overview from './views/OverviewNavigator'
import Settings from './views/Settings/SettingsView'
import MyTeam from './views/MyTeamNavigator'
import Leagues from './views/LeaguesView'

import {
  OVERVIEW_NAVIGATOR,
  MY_TEAM_NAVIGATOR,
  LEAGUES_NAVIGATOR,
  SETTINGS_NAVIGATOR
} from './views/routes'
import strings from './Strings'


const drawerWidth = 260



export default DrawerNavigator({
    [OVERVIEW_NAVIGATOR]: { screen: Overview },
    [MY_TEAM_NAVIGATOR]: { screen: MyTeam },
    [LEAGUES_NAVIGATOR]: { screen: Leagues },
    [SETTINGS_NAVIGATOR]: { screen: Settings }
}, {
    contentComponent: Drawer,
    drawerWidth
})
