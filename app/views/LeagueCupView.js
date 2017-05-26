import PlayerStatsView from './PlayerStatsView';
import SelectableMatchListView from './SelectableMatchListView';
import { TabNavigator } from 'react-navigation';
import NavTabBarTop from '../Nav/NavTabBarTop';
import { TAB_MATCHES, TAB_PLAYER_STATS } from './routes';
import strings from '../Strings';

export default TabNavigator(
  {
    [TAB_MATCHES]: {
      screen: SelectableMatchListView,
      navigationOptions: { title: strings.matches },
    },
    [TAB_PLAYER_STATS]: {
      screen: PlayerStatsView,
      navigationOptions: { title: strings.player_statistics },
    },
  },
  { ...NavTabBarTop, tabBarOptions: { scrollEnabled: false } },
);
