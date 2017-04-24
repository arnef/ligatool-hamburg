import { TabNavigator } from 'react-navigation'

import NavTabBarTop from '../../Nav/NavTabBarTop'
import NavIcon from '../../Nav/NavIcon'
import TeamView from './TeamDetails'
import TeamMatches from './TeamMatches'
import { TAB_TEAM, TAB_MATCHES } from '../routes'

TeamView.navigationOptions = { title: 'Team' }
TeamMatches.navigationOptions = { title: 'Begegnungen' }

const Team = TabNavigator({
    [TAB_TEAM]: { screen: TeamView },
    [TAB_MATCHES]: { screen: TeamMatches }
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
