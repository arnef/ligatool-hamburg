import TableView from './TableView'
import SelectableMatchListView from './SelectableMatchListView'
import NavIcon from '../Nav/NavIcon'
import { TabNavigator } from 'react-navigation'
import NavTabBarTop from '../Nav/NavTabBarTop'

const LeagueView = TabNavigator({
    League: { screen: TableView },
    MatchDay: { screen: SelectableMatchListView }
}, {
    tabBarComponent: NavTabBarTop,
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    lazyLoad: true
})

LeagueView.navigationOptions = {
    title: ({ state }) => state.params.title,
    tabBar: {
        icon: ({ tintColor }) => NavIcon('trophy', tintColor),
        label: 'Gruppen'
    }
}

export default LeagueView