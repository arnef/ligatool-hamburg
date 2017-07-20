// @flow
import { TabNavigator } from 'react-navigation';

import NavTabBarTop from '../../Nav/NavTabBarTop';
import TeamView from './TeamDetails';
import TeamMatches from './TeamMatches';
import Routes from '../../config/routes';
import strings from '../../lib/strings';

export default TabNavigator(
  {
    [Routes.TAB_TEAM]: {
      screen: TeamView,
      navigationOptions: { title: strings.team },
    },
    [Routes.TAB_MATCHES]: {
      screen: TeamMatches,
      navigationOptions: { title: strings.matches },
    },
  },
  {
    ...NavTabBarTop,
    tabBarOptions: { scrollEnabled: false },
  },
);
