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

import * as React from 'react';
import {
  NavigationContainer,
  StackNavigator,
  TabNavigator,
  NavigationRouteConfigMap,
} from 'react-navigation';
import { Routes } from 'src/scenes/routes';
import {
  TabBarIcon,
  TabBarBottom,
  headerNavigationOptions,
} from 'src/containers/navigation';

import { Overview } from 'src/scenes/app/scenes/overview';
import { Strings } from 'src/lib/strings';
import { MyTeam } from './scenes/my-team';
import { Competitions } from './scenes/competitions';
import { Settings } from './scenes/settings';

import { FixtureDetails } from './scenes/fixture-details';
import { Competition } from './scenes/competitions/scenes/competition';
import { Cup } from './scenes/competitions/scenes/cup';
import { TeamDetails } from './scenes/team-details';
import { PlayerDetails } from './scenes/player-details';
import { ChangeDate } from './scenes/fixture-details/scenes/change-date';
import { getNavigationStateParams } from '../../redux/modules/navigation';

function createTabStackNavigator(
  key: string,
  screen: NavigationContainer | React.ComponentClass,
  title: string,
  screens?: any,
) {
  const defaultScreens = {
    [key]: {
      screen,
      navigationOptions: { title },
    },
    [Routes.fixtureDetails]: {
      screen: FixtureDetails,
      navigationOptions: ({ navigation }: any) => ({
        title:
          getNavigationStateParams(navigation) &&
          getNavigationStateParams(navigation).title
            ? getNavigationStateParams(navigation).title
            : Strings.MATCH,
      }),
    },
    [Routes.fixtureDetailsChangeDate]: {
      screen: ChangeDate,
      navigationOptions: {
        title: Strings.CHANGE_MATCH_DATETIME,
      },
    },
    [Routes.teamDetails]: {
      screen: TeamDetails,
      navigationOptions: ({ navigation }: any) => ({
        title: getNavigationStateParams(navigation).title,
      }),
    },
    [Routes.playerDetails]: {
      screen: PlayerDetails,
      navigationOptions: ({ navigation }: any) => {
        const player = getNavigationStateParams(navigation);
        return {
          title: `${player.name} ${player.surname}`,
        };
      },
    },
    // [Routes.competition]: {

    // }
  };

  return StackNavigator(
    screens ? { ...defaultScreens, ...screens } : defaultScreens,
    headerNavigationOptions,
  );
}

interface AppTab {
  route: string;
  title: string;
  screen: NavigationContainer | React.ComponentClass;
  icon: string;
  customStack?: boolean;
  screens?: any;
}

function createTabs(tabs: Array<AppTab>): NavigationRouteConfigMap {
  const tabsMap: NavigationRouteConfigMap = {};
  for (let tab of tabs) {
    tabsMap[tab.route] = {
      screen: tab.customStack
        ? tab.screen
        : createTabStackNavigator(
            tab.route,
            tab.screen,
            tab.title,
            tab.screens,
          ),
      navigationOptions: {
        tabBarLabel: tab.title,
        tabBarIcon: ({ tintColor }: { tintColor: string }) => (
          <TabBarIcon name={tab.icon} color={tintColor} />
        ),
      },
    };
  }
  return tabsMap;
}

export const AppScenes = TabNavigator(
  createTabs([
    {
      route: Routes.overview,
      screen: Overview,
      title: Strings.OVERVIEW,
      icon: 'football',
    },
    {
      route: Routes.myTeam,
      screen: MyTeam,
      title: Strings.MY_TEAM,
      icon: 'shirt',
    },
    {
      route: Routes.competitions,
      screen: Competitions,
      title: Strings.LEAGUES,
      icon: 'trophy',
      screens: {
        [Routes.competition]: {
          screen: Competition,
          navigationOptions: ({ navigation }: any) => ({
            title: getNavigationStateParams(navigation).title,
          }),
        },
        [Routes.cup]: {
          screen: Cup,
          navigationOptions: ({ navigation }: any) => ({
            title: getNavigationStateParams(navigation).title,
          }),
        },
      },
    },
    {
      route: Routes.settings,
      screen: Settings,
      title: Strings.SETTINGS,
      icon: 'settings',
      customStack: true,
    },
  ]),
  {
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    lazy: true,
  },
);
