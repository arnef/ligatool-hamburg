// @flow
import { TabNavigator } from 'react-navigation';
import NavTabBarTop from '../../Nav/NavTabBarTop';
import Routes from '../../config/routes';
import S from '../../lib/strings';
import { MatchList, PlayerStatsList } from '../../components';

export default TabNavigator(
  {
    [Routes.TAB_MATCHES]: {
      screen: MatchList.Selectable,
      navigationOptions: { title: S.MATCHES },
    },
    [Routes.TAB_PLAYER_STATS]: {
      screen: PlayerStatsList,
      navigationOptions: { title: S.STATISTICS },
    },
  },
  {
    ...NavTabBarTop,
    tabBarOptions: { scrollEnabled: false },
  },
);
