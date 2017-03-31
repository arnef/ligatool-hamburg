import { StackNavigator } from 'react-navigation'
import NavIcon from '../Nav/NavIcon'
import NavHeader from '../Nav/NavHeader'
import Overview from './Overview'
import Match from './MatchView'

const NavStack = StackNavigator({
    Overview: { screen: Overview },
    Match: { screen: Match }
}, {
    navigationOptions: {
        header: NavHeader
    }
})

NavStack.navigationOptions = {
    title: 'Übersicht',
    tabBar: {
        icon: ({ tintColor }) => NavIcon('football', tintColor)
    }
}

export default NavStack