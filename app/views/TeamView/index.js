import { TabNavigator } from 'react-navigation'

import NavTabBarTop from '../../Nav/NavTabBarTop'
import NavIcon from '../../Nav/NavIcon'
import TeamView from './TeamDetails'
import TeamMatches from './TeamMatches'

TeamView.navigationOptions = { title: 'Team' }
TeamMatches.navigationOptions = { title: 'Begegnungen' }

const Team = TabNavigator({
    TeamDetails: { screen: TeamView },
    TeamMatches: { screen: TeamMatches }
}, {
    ...NavTabBarTop
})

Team.navigationOptions = {
    title: ({ state }) => state.params.title,
    tabBar: {
        label: 'Gruppen',
        icon: ({ tintColor }) => NavIcon('trophy', tintColor)

    }
}
export default Team