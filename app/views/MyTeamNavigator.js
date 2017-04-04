import { StackNavigator } from 'react-navigation'
import MyTeamView from './MyTeamView'
import MatchView from './MatchView'
import Preview from './MatchView/PreView'
import NavHeader from '../Nav/NavHeader'
import TeamView from './TeamView'

export default StackNavigator({
    MyTeam: { screen: MyTeamView },
    MyTeamMatch: { screen: MatchView },
    MyTeamPreview: { screen: Preview },
    MyTeamTeam: { screen: TeamView }
}, {
    ...NavHeader
})