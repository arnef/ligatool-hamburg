
import TableView from './TableView'
import SelectableMatchListView from './SelectableMatchListView'
import { TabNavigator } from 'react-navigation'
import NavTabBarTop from '../Nav/NavTabBarTop'
import NavDrawerIcon from '../Nav/NavDrawerIcon'

TableView.navigationOptions = { title: 'Tabelle' }

const LeagueView = TabNavigator({
    League: { screen: TableView },
    MatchDay: { screen: SelectableMatchListView }
}, {
    ...NavTabBarTop
})

LeagueView.navigationOptions = {
    title: ({ state }) => state.params.title,
    header: NavDrawerIcon
}

export default LeagueView