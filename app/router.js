// @flow
import { Platform } from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
} from 'react-navigation';
import Routes from './config/routes';
import ModalLogin from './modals/LoginModal';
import ModalSelectPlayer from './modals/SelectPlayerModal';
import NavHeader from './Nav/NavHeader';
import NavDrawerIcon from './Nav/NavDrawerIcon';
import NavIcon from './Nav/NavIcon';
import NavTabBarBottom from './Nav/NavTabBarBottom';

import Drawer, { DRAWER_WIDTH } from './views/DrawerView';

import Overview from './routes/Overview';
import Match from './routes/Match';
import MyTeam from './views/MyTeamView';
import Leagues from './views/LeaguesView';
import League from './views/LeagueView';
import Settings from './views/Settings/SettingsView';
import SettingsNotification from './views/Settings/SettingsNotificationView';

import Preview from './views/MatchView/PreView';
import Team from './views/TeamView';
import LeagueCup from './views/LeagueCupView';
import PlayerView from './views/PlayerView';
import strings from './lib/strings';

function createTabStack(key: string, screen: any, optionalRoutes: ?any): any {
  const name = key.split('/');
  const defaultRoutes = {
    [key]: {
      screen,
      navigationOptions: {
        title: strings[name[name.length - 1].toLowerCase()],
      },
    },
    [Routes.MATCH]: {
      screen: Match,
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.title || strings.match,
      }),
    },
    [Routes.PREVIEW]: { screen: Preview },
    [Routes.TEAM]: {
      screen: Team,
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.title,
      }),
    },
    [Routes.PLAYER]: {
      screen: PlayerView,
      navigationOptions: ({ navigation }) => ({
        title: `${navigation.state.params.name} ${navigation.state.params
          .surname}`,
      }),
    },
  };
  const routes = optionalRoutes
    ? { ...defaultRoutes, ...optionalRoutes }
    : defaultRoutes;

  return StackNavigator(routes, NavHeader);
}

export const OverviewStack = createTabStack(Routes.OVERVIEW, Overview);
export const MyTeamStack = createTabStack(Routes.MY_TEAM, MyTeam);
export const LeaguesStack = createTabStack(Routes.LEAGUES, Leagues, {
  [Routes.LEAGUE]: {
    screen: League,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.title,
    }),
  },
  [Routes.LEAGUE_CUP]: {
    screen: LeagueCup,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.title,
    }),
  },
});

export const SettingStack = StackNavigator(
  {
    [Routes.SETTINGS]: {
      screen: Settings,
      navigationOptions: {
        title: strings.settings,
      },
    },
    [Routes.SETTINGS_NOTIFICATIONS]: {
      screen: SettingsNotification,
      navigationOptions: {
        title: strings.notifications,
      },
    },
  },
  NavHeader,
);

export const App =
  Platform.OS === 'android'
    ? DrawerNavigator(
        {
          [Routes.OVERVIEW]: {
            screen: StackNavigator(
              {
                [Routes.OVERVIEW]: {
                  screen: Overview,
                  navigationOptions: NavDrawerIcon(strings.overview),
                },
                [Routes.MY_TEAM]: {
                  screen: MyTeam,
                  navigationOptions: NavDrawerIcon(strings.my_team),
                },
                [Routes.LEAGUE]: {
                  screen: League,
                  navigationOptions: NavDrawerIcon(),
                },
                [Routes.LEAGUE_CUP]: {
                  screen: LeagueCup,
                  navigationOptions: NavDrawerIcon(),
                },
                [Routes.MATCH]: {
                  screen: Match,
                  navigationOptions: { title: strings.match },
                },
                [Routes.TEAM]: {
                  screen: Team,
                  navigationOptions: ({ navigation }) => ({
                    title: navigation.state.params.title,
                  }),
                },
                [Routes.PREVIEW]: {
                  screen: Preview,
                },
                [Routes.PLAYER]: {
                  screen: PlayerView,
                  navigationOptions: ({ navigation }) => ({
                    title: `${navigation.state.params.name} ${navigation.state
                      .params.surname}`,
                  }),
                },
                [Routes.SETTINGS]: {
                  screen: Settings,
                  navigationOptions: NavDrawerIcon(strings.settings),
                },
                [Routes.SETTINGS_NOTIFICATIONS]: {
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
          [Routes.OVERVIEW]: {
            screen: OverviewStack,
            navigationOptions: {
              tabBarLabel: strings.overview,
              tabBarIcon: ({ tintColor }) => NavIcon('football', tintColor),
            },
          },
          [Routes.MY_TEAM]: {
            screen: MyTeamStack,
            navigationOptions: {
              tabBarLabel: strings.my_team,
              tabBarIcon: ({ tintColor }) => NavIcon('shirt', tintColor),
            },
          },
          [Routes.LEAGUES]: {
            screen: LeaguesStack,
            navigationOptions: {
              tabBarLabel: strings.leagues,
              tabBarIcon: ({ tintColor }) => NavIcon('trophy', tintColor),
            },
          },
          [Routes.SETTINGS]: {
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
    [Routes.APP]: { screen: App },
    [Routes.MODAL_LOGIN]: { screen: ModalLogin },
    [Routes.MODAL_SELECT_PLAYER]: { screen: ModalSelectPlayer },
  },
  {
    headerMode: 'none',
    mode: 'modal',
    initialRouteName: Routes.APP,
  },
);
