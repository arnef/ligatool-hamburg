import { StackNavigator } from 'react-navigation'
import NavHeader from '../Nav/NavHeader'
import Overview from './Overview'
import Match from './MatchView'
import PreviewMatch from './MatchView/PreView'
import TeamView from './TeamView'

export default StackNavigator({
    Overview: { screen: Overview },
    OverviewMatch: { screen: Match },
    OverviewPreview: { screen: PreviewMatch },
    OverviewTeam: { screen: TeamView }
}, {
    ...NavHeader
})