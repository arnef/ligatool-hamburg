// @flow
import { TabNavigator } from 'react-navigation';
import NavTabBarTop from '../../Nav/NavTabBarTop';
import { MatchList, PlayerStatsList, Table } from '../../components';

import Routes from '../../config/routes';
import strings from '../../lib/strings';

export default TabNavigator(
  {
    [Routes.TAB_LEAGUE_MATCHES]: {
      screen: MatchList.Selectable,
      navigationOptions: { title: strings.matches },
    },
    [Routes.TAB_TABLE]: {
      screen: Table,
      navigationOptions: { title: strings.table },
    },
    [Routes.TAB_PLAYER_STATS]: {
      screen: PlayerStatsList,
      navigationOptions: { title: strings.player_statistics },
    },
  },
  {
    ...NavTabBarTop,
    initialRouteName: Routes.TAB_TABLE,
  },
);
