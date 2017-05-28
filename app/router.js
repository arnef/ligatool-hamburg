// @flow
import { Platform } from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
} from 'react-navigation';
import {
  APP,
  MODAL_LOGIN,
  MODAL_SELECT_PLAYER,
  OVERVIEW,
  MY_TEAM,
  LEAGUES,
  LEAGUE_CUP,
  SETTINGS,
  SETTINGS_NOTIFICATIONS,
  LEAGUE,
  MATCH,
  PREVIEW,
  TEAM,
  PLAYER,
} from './views/routes';

import ModalLogin from './modals/LoginModal';
import ModalSelectPlayer from './modals/SelectPlayerModal';
import NavHeader from './Nav/NavHeader';
import NavDrawerIcon from './Nav/NavDrawerIcon';
import NavIcon from './Nav/NavIcon';
import NavTabBarBottom from './Nav/NavTabBarBottom';

import Drawer, { DRAWER_WIDTH } from './views/DrawerView';

import Overview from './views/Overview';
import MyTeam from './views/MyTeamView';
import Leagues from './views/LeaguesView';
import League from './views/LeagueView';
import Settings from './views/Settings/SettingsView';
import SettingsNotification from './views/Settings/SettingsNotificationView';
import Match from './views/MatchView';
import Preview from './views/MatchView/PreView';
import Team from './views/TeamView';
import LeagueCup from './views/LeagueCupView';
import PlayerView from './views/PlayerView';
import strings from './Strings';

function createTabStack(key: string, screen: any, optionalRoutes: ?any): any {
  const defaultRoutes = {
    [key]: {
      screen,
      navigationOptions: { title: strings[key.toLowerCase()] },
    },
    [MATCH]: {
      screen: Match,
      navigationOptions: { title: strings.match },
    },
    [PREVIEW]: { screen: Preview },
    [TEAM]: {
      screen: Team,
      navigationOptions: { title: ({ state }) => state.params.title },
    },
    [PLAYER]: {
      screen: PlayerView,
      navigationOptions: {
        title: ({ state }) => `${state.params.name} ${state.params.surname}`,
      },
    },
  };
  const routes = optionalRoutes
    ? { ...defaultRoutes, ...optionalRoutes }
    : defaultRoutes;

  return StackNavigator(routes, NavHeader);
}

export const OverviewStack = createTabStack(OVERVIEW, Overview);
export const MyTeamStack = createTabStack(MY_TEAM, MyTeam);
export const LeaguesStack = createTabStack(LEAGUES, Leagues, {
  [LEAGUE]: {
    screen: League,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.title,
    }),
  },
  [LEAGUE_CUP]: {
    screen: LeagueCup,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.title,
    }),
  },
});

export const SettingStack = StackNavigator(
  {
    [SETTINGS]: {
      screen: Settings,
      navigationOptions: {
        title: strings.settings,
      },
    },
    [SETTINGS_NOTIFICATIONS]: {
      screen: SettingsNotification,
      navigationOptions: {
        title: strings.notifications,
      },
    },
  },
  NavHeader,
);

export const App = Platform.OS === 'android'
  ? DrawerNavigator(
      {
        [OVERVIEW]: {
          screen: StackNavigator(
            {
              [OVERVIEW]: {
                screen: Overview,
                navigationOptions: NavDrawerIcon(strings.overview),
              },
              [MY_TEAM]: {
                screen: MyTeam,
                navigationOptions: NavDrawerIcon(strings.my_team),
              },
              [LEAGUE]: {
                screen: League,
                navigationOptions: NavDrawerIcon(),
              },
              [LEAGUE_CUP]: {
                screen: LeagueCup,
                navigationOptions: NavDrawerIcon(),
              },
              [MATCH]: {
                screen: Match,
                navigationOptions: { title: strings.match },
              },
              [TEAM]: {
                screen: Team,
                navigationOptions: ({ navigation }) => ({
                  title: navigation.state.params.title,
                }),
              },
              [PREVIEW]: {
                screen: Preview,
              },
              [PLAYER]: {
                screen: PlayerView,
                navigationOptions: ({ navigation }) => ({
                  title: `${navigation.state.params.name} ${navigation.state.params.surname}`,
                }),
              },
              [SETTINGS]: {
                screen: Settings,
                navigationOptions: NavDrawerIcon(strings.settings),
              },
              [SETTINGS_NOTIFICATIONS]: {
                screen: SettingsNotification,
                navigationOptions: { title: strings.notifications },
              },
            },
            NavHeader,
          ),
        },
      },
      {
        contentComponent: Drawer,
        drawerWidth: DRAWER_WIDTH,
      },
    )
  : TabNavigator(
      {
        [OVERVIEW]: {
          screen: OverviewStack,
          navigationOptions: {
            tabBarLabel: strings.overview,
            tabBarIcon: ({ tintColor }) => NavIcon('football', tintColor),
          },
        },
        [MY_TEAM]: {
          screen: MyTeamStack,
          navigationOptions: {
            tabBarLabel: strings.my_team,
            tabBarIcon: ({ tintColor }) => NavIcon('shirt', tintColor),
          },
        },
        [LEAGUES]: {
          screen: LeaguesStack,
          navigationOptions: {
            tabBarLabel: strings.leagues,
            tabBarIcon: ({ tintColor }) => NavIcon('trophy', tintColor),
          },
        },
        [SETTINGS]: {
          screen: SettingStack,
          navigationOptions: {
            tabBarLabel: strings.settings,
            tabBarIcon: ({ tintColor }) => NavIcon('settings', tintColor),
          },
        },
      },
      {
        tabBarComponent: NavTabBarBottom,
        tabBarPosition: 'bottom',
        swipedEnabled: false,
        animationEnabled: false,
        lazy: true,
      },
    );

export const Root: StackNavigator = StackNavigator(
  {
    [APP]: { screen: App },
    [MODAL_LOGIN]: { screen: ModalLogin },
    [MODAL_SELECT_PLAYER]: { screen: ModalSelectPlayer },
  },
  {
    headerMode: 'none',
    mode: 'modal',
    initialRouteName: APP,
  },
);
