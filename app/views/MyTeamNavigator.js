import { StackNavigator } from 'react-navigation'
import MyTeamView from './MyTeamView'
import MatchView from './MatchView'
import Preview from './MatchView/PreView'
import NavHeader from '../Nav/NavHeader'
import TeamView from './TeamView'
import { MY_TEAM, MY_TEAM_NAVIGATOR, MATCH, PREVIEW, TEAM } from './routes'

export default StackNavigator({
    [MY_TEAM]: { screen: MyTeamView },
    [MY_TEAM_NAVIGATOR + MATCH]: { screen: MatchView },
    [MY_TEAM_NAVIGATOR + PREVIEW]: { screen: Preview },
    [MY_TEAM_NAVIGATOR + TEAM]: { screen: TeamView }
}, {
    ...NavHeader
})
