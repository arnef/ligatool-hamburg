import { Platform } from 'react-native'
import TableView from './TableView'
import SelectableMatchListView from './SelectableMatchListView'
import NavIcon from '../Nav/NavIcon'
import { TabNavigator } from 'react-navigation'
import NavTabBarTop from '../Nav/NavTabBarTop'
import NavDrawerIcon from '../Nav/NavDrawerIcon'
import { ANDROID } from '../consts'

TableView.navigationOptions = { title: 'Tabelle' }
// SelectableMatchListView.navigationOptions = { title: 'Begegnungen' }

const LeagueView = TabNavigator({
    League: { screen: TableView },
    MatchDay: { screen: SelectableMatchListView }
}, {
    ...NavTabBarTop
    // tabBarComponent: NavTabBarTop,
    // tabBarPosition: 'top',
    // swipeEnabled: true,
    // animationEnabled: true,
    // lazyLoad: true
})

LeagueView.navigationOptions = {
    title: ({ state }) => state.params.title,
    header: NavDrawerIcon
}

export default LeagueView