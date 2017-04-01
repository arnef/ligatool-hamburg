import { StackNavigator } from 'react-navigation'
import NavHeader from '../Nav/NavHeader'
import Overview from './Overview'
import Match from './MatchView'
import Team from './TeamView'
import PreviewMatch from './MatchView/PreView'

export default StackNavigator({
    Overview: { screen: Overview },
    OverviewMatch: { screen: Match },
    MatchPreview: { screen: PreviewMatch },
    Team: { screen: Team }
}, {
    ...NavHeader
})