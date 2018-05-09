/**
 * Copyright (C) 2018 Arne Feil
 *
 * This file is part of DTFB App.
 *
 * DTFB App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DTFB App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DTFB App.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { topTabBarNavigationOptions } from '@app/containers/navigation';
import { Strings } from '@app/lib/strings';
import { Routes } from '@app/scenes/routes';
import { TabNavigator } from 'react-navigation';

import { ConnectedPlayerStatsList } from './PlayerStatsList';
import { ConnectedSelectableMatchList } from './SelectableMatchList';
import { ConnectedTable } from './Table';
export const Competition = TabNavigator(
  {
    [Routes.competitionFixtures]: {
      navigationOptions: {
        title: Strings.MATCHES,
      },
      screen: ConnectedSelectableMatchList,
    },
    [Routes.competition]: {
      navigationOptions: {
        title: Strings.TABLE,
      },
      screen: ConnectedTable,
    },
    [Routes.competitionStats]: {
      navigationOptions: {
        title: Strings.STATISTICS,
      },
      screen: ConnectedPlayerStatsList,
    },
  },
  {
    ...topTabBarNavigationOptions,
    initialRouteName: Routes.competition,
  },
);
