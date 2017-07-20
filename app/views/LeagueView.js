import TableView from './TableView';
import PlayerStatsView from './PlayerStatsView';
import SelectableMatchListView from './SelectableMatchListView';
import { TabNavigator } from 'react-navigation';
import NavTabBarTop from '../Nav/NavTabBarTop';
import Routes from '../config/routes';
import strings from '../lib/strings';

const LeagueView = TabNavigator(
  {
    [Routes.TAB_MATCHES]: {
      screen: SelectableMatchListView,
      navigationOptions: { title: strings.matches },
    },
    [Routes.TAB_TABLE]: {
      screen: TableView,
      navigationOptions: { title: strings.table },
    },
    [Routes.TAB_PLAYER_STATS]: {
      screen: PlayerStatsView,
      navigationOptions: { title: strings.player_statistics },
    },
  },
  { ...NavTabBarTop, initialRouteName: Routes.TAB_TABLE },
);

export default LeagueView;
