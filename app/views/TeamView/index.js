// @flow
import { TabNavigator } from 'react-navigation';

import NavTabBarTop from '../../Nav/NavTabBarTop';
import NavIcon from '../../Nav/NavIcon';
import TeamView from './TeamDetails';
import TeamMatches from './TeamMatches';
import { TAB_TEAM, TAB_MATCHES } from '../routes';
import strings from '../../Strings';

export default TabNavigator(
  {
    [TAB_TEAM]: {
      screen: TeamView,
      navigationOptions: { title: strings.team },
    },
    [TAB_MATCHES]: {
      screen: TeamMatches,
      navigationOptions: { title: strings.matches },
    },
  },
  {
    ...NavTabBarTop,
    tabBarOptions: { scrollEnabled: false },
  },
);
