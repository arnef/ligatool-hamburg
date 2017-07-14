import TableView from './TableView';
import PlayerStatsView from './PlayerStatsView';
import SelectableMatchListView from './SelectableMatchListView';
import { TabNavigator } from 'react-navigation';
import NavTabBarTop from '../Nav/NavTabBarTop';
import { TAB_TABLE, TAB_MATCHES, TAB_PLAYER_STATS } from './routes';
import strings from '../Strings';

const LeagueView = TabNavigator(
  {
    [TAB_MATCHES]: {
      screen: SelectableMatchListView,
      navigationOptions: { title: strings.matches },
    },
    [TAB_TABLE]: {
      screen: TableView,
      navigationOptions: { title: strings.table },
    },
    [TAB_PLAYER_STATS]: {
      screen: PlayerStatsView,
      navigationOptions: { title: strings.player_statistics },
    },
  },
  { ...NavTabBarTop, initialRouteName: TAB_TABLE },
);

export default LeagueView;
