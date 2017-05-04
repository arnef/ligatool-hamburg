
import TableView from './TableView'
import SelectableMatchListView from './SelectableMatchListView'
import { TabNavigator } from 'react-navigation'
import NavTabBarTop from '../Nav/NavTabBarTop'
import NavDrawerIcon from '../Nav/NavDrawerIcon'
import { TAB_TABLE, TAB_MATCHES } from './routes';
import strings from '../Strings';

const LeagueView = TabNavigator({
    [TAB_TABLE]: {
      screen: TableView,
      navigationOptions: { title: strings.table }
    },
    [TAB_MATCHES]: {
      screen: SelectableMatchListView,
      navigationOptions: { title: strings.matches }
    }
}, { ...NavTabBarTop });

export default LeagueView
