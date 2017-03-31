import { StackNavigator } from 'react-navigation'
import MyTeamView from './MyTeamView'
import MatchView from './MatchView'
import NavHeader from '../Nav/NavHeader'

export default StackNavigator({
    MyTeam: { screen: MyTeamView },
    Match: { screen: MatchView }
}, {
    navigationOptions: {
        header: NavHeader
    }
})