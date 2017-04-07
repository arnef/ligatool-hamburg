import { StackNavigator } from 'react-navigation'
import NavHeader from '../Nav/NavHeader'
import Overview from './Overview'
import Match from './MatchView'
import PreviewMatch from './MatchView/PreView'
import TeamView from './TeamView'
import { OVERVIEW, OVERVIEW_NAVIGATOR, MATCH, PREVIEW, TEAM } from './routes'


export default StackNavigator({
    [OVERVIEW]: { screen: Overview },
    [OVERVIEW_NAVIGATOR + MATCH]: { screen: Match },
    [OVERVIEW_NAVIGATOR + PREVIEW]: { screen: PreviewMatch },
    [OVERVIEW_NAVIGATOR + TEAM]: { screen: TeamView }
}, {
    ...NavHeader
})
