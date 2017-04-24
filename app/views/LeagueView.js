
import TableView from './TableView'
import SelectableMatchListView from './SelectableMatchListView'
import { TabNavigator } from 'react-navigation'
import NavTabBarTop from '../Nav/NavTabBarTop'
import NavDrawerIcon from '../Nav/NavDrawerIcon'
import { TAB_TABLE, TAB_MATCHES } from './routes';

TableView.navigationOptions = { title: 'Tabelle' }

const LeagueView = TabNavigator({
    [TAB_TABLE]: { screen: TableView },
    [TAB_MATCHES]: { screen: SelectableMatchListView }
}, {
    ...NavTabBarTop
})

LeagueView.navigationOptions = {
    title: ({ state }) => state.params.title,
    header: NavDrawerIcon
}

export default LeagueView
