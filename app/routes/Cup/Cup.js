// @flow
import { TabNavigator } from 'react-navigation';
import NavTabBarTop from '../../Nav/NavTabBarTop';
import Routes from '../../config/routes';
import strings from '../../lib/strings';
import { MatchList, PlayerStatsList } from '../../components';

export default TabNavigator(
  {
    [Routes.TAB_MATCHES]: {
      screen: MatchList.Selectable,
      navigationOptions: { title: strings.matches },
    },
    [Routes.TAB_PLAYER_STATS]: {
      screen: PlayerStatsList,
      navigationOptions: { title: strings.player_statistics },
    },
  },
  {
    ...NavTabBarTop,
    tabBarOptions: { scrollEnabled: false },
  },
);
