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

import {
  headerNavigationOptions,
  TabBarBottom,
  TabBarIcon,
} from '@app/containers/navigation';
import { Strings } from '@app/lib/strings';
import { getNavigationStateParams } from '@app/redux/modules/navigation';
import { Overview } from '@app/scenes/app/scenes/overview';
import { Routes } from '@app/scenes/routes';
import * as React from 'react';
import {
  NavigationContainer,
  NavigationRouteConfigMap,
  StackNavigator,
  TabNavigator,
} from 'react-navigation';

import { Competitions } from './scenes/competitions';
import { Competition } from './scenes/competitions/scenes/competition';
import { Cup } from './scenes/competitions/scenes/cup';
import { FixtureDetails } from './scenes/fixture-details';
import { ChangeDate } from './scenes/fixture-details/scenes/change-date';
import { MyTeam } from './scenes/my-team';
import { PlayerDetails } from './scenes/player-details';
import { Settings } from './scenes/settings';
import { TeamDetails } from './scenes/team-details';

function createTabStackNavigator(
  key: string,
  screen: NavigationContainer | React.ComponentClass,
  title: string,
  screens?: any,
) {
  const defaultScreens = {
    [key]: {
      navigationOptions: { title },
      screen,
    },
    [Routes.fixtureDetails]: {
      navigationOptions: ({ navigation }: any) => ({
        title:
          getNavigationStateParams(navigation) &&
          getNavigationStateParams(navigation).title
            ? getNavigationStateParams(navigation).title
            : Strings.MATCH,
      }),
      screen: FixtureDetails,
    },
    [Routes.fixtureDetailsChangeDate]: {
      navigationOptions: {
        title: Strings.CHANGE_MATCH_DATETIME,
      },
      screen: ChangeDate,
    },
    [Routes.teamDetails]: {
      navigationOptions: ({ navigation }: any) => ({
        title: getNavigationStateParams(navigation).title,
      }),
      screen: TeamDetails,
    },
    [Routes.playerDetails]: {
      navigationOptions: ({ navigation }: any) => {
        const player = getNavigationStateParams(navigation);
        return {
          title: `${player.name} ${player.surname}`,
        };
      },
      screen: PlayerDetails,
    },
  };

  return StackNavigator(
    screens ? { ...defaultScreens, ...screens } : defaultScreens,
    headerNavigationOptions,
  );
}

interface IAppTab {
  route: string;
  title: string;
  screen: NavigationContainer | React.ComponentClass;
  icon: string;
  customStack?: boolean;
  screens?: any;
}

function createTabs(tabs: IAppTab[]): NavigationRouteConfigMap {
  const tabsMap: NavigationRouteConfigMap = {};
  for (const tab of tabs) {
    tabsMap[tab.route] = {
      navigationOptions: {
        tabBarIcon: ({ tintColor }: { tintColor: string }) => (
          <TabBarIcon name={tab.icon} color={tintColor} />
        ),
        tabBarLabel: tab.title,
      },
      screen: tab.customStack
        ? tab.screen
        : createTabStackNavigator(
            tab.route,
            tab.screen,
            tab.title,
            tab.screens,
          ),
    };
  }
  return tabsMap;
}

export const AppScenes = TabNavigator(
  createTabs([
    {
      icon: 'football',
      route: Routes.overview,
      screen: Overview,
      title: Strings.OVERVIEW,
    },
    {
      icon: 'shirt',
      route: Routes.myTeam,
      screen: MyTeam,
      title: Strings.MY_TEAM,
    },
    {
      icon: 'trophy',
      route: Routes.competitions,
      screen: Competitions,
      screens: {
        [Routes.competition]: {
          navigationOptions: ({ navigation }: any) => ({
            title: getNavigationStateParams(navigation).title,
          }),
          screen: Competition,
        },
        [Routes.cup]: {
          navigationOptions: ({ navigation }: any) => ({
            title: getNavigationStateParams(navigation).title,
          }),
          screen: Cup,
        },
      },
      title: Strings.LEAGUES,
    },
    {
      customStack: true,
      icon: 'settings',
      route: Routes.settings,
      screen: Settings,
      title: Strings.SETTINGS,
    },
  ]),
  {
    animationEnabled: false,
    lazy: true,
    swipeEnabled: false,
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
  },
);
