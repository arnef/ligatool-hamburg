import { TabNavigator } from 'react-navigation';
import NavTabBarTop from '../../Nav/NavTabBarTop';
import { MatchList, Table } from '../../components';

import Routes from '../../config/routes';
import S from '../../lib/strings';

export default TabNavigator(
  {
    [Routes.TAB_LEAGUE_MATCHES]: {
      screen: MatchList.Selectable,
      navigationOptions: { title: S.MATCHES },
    },
    [Routes.TAB_TABLE]: {
      screen: Table,
      navigationOptions: { title: S.TABLE },
    },
    // [Routes.TAB_PLAYER_STATS]: {
    //   screen: PlayerStatsList,
    //   navigationOptions: { title: S.STATISTICS },
    // },
  },
  {
    ...NavTabBarTop,
    initialRouteName: Routes.TAB_TABLE,
  },
);
