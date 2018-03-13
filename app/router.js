import { Platform } from 'react-native';
import {
  StackNavigator,
  TabNavigator,
  DrawerNavigator,
} from 'react-navigation';
import Routes from './config/routes';
import ModalLogin from './modals/LoginModal';
import ModalSelectPlayer from './modals/SelectPlayerModal';
import FirstStart from './modals/FirstStart';
import NavHeader from './Nav/NavHeader';
import NavDrawerIcon from './Nav/NavDrawerIcon';
import NavIcon from './Nav/NavIcon';
import NavTabBarBottom from './Nav/NavTabBarBottom';

import Drawer, { DRAWER_WIDTH } from './routes/Drawer';

import Overview from './routes/Overview';
import Match from './routes/Match';
import MyTeam from './routes/MyTeam';
import Leagues from './routes/Leagues';
import League from './routes/League';
import Settings from './routes/Settings';
import SettingsNotification from './routes/SettingsNotification';
import SettingsNotificationTeams from './routes/SettingsNotification/SubscribeTeams';
import Search from './routes/Search';
import SearchHeader from './routes/Search/SearchHeader';

import Team from './routes/Team';
import LeagueCup from './routes/Cup';
import PlayerView from './routes/Player';
import MatchDate from './routes/MatchDate';
import S from './lib/strings';
import { getNavigationStateParams } from './redux/modules/navigation';

function createTabStack(key, screen, optionalRoutes) {
  const name = key.split('/');
  const defaultRoutes = {
    [key]: {
      screen,
      navigationOptions: {
        title: S[name[name.length - 1]],
      },
    },
    [Routes.MATCH]: {
      screen: Match,
      navigationOptions: ({ navigation }) => ({
        title:
          getNavigationStateParams(navigation) &&
          getNavigationStateParams(navigation).title
            ? getNavigationStateParams(navigation).title
            : S.MATCH,
      }),
    },
    [Routes.TEAM]: {
      screen: Team,
      navigationOptions: ({ navigation }) => ({
        title: getNavigationStateParams(navigation).title,
      }),
    },
    [Routes.PLAYER]: {
      screen: PlayerView,
      navigationOptions: ({ navigation }) => ({
        title: `${getNavigationStateParams(navigation).name} ${
          getNavigationStateParams(navigation).surname
        }`,
      }),
    },
    [Routes.MATCH_DATE]: {
      screen: MatchDate,
      navigationOptions: { title: S.CHANGE_MATCH_DATETIME },
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
      title: getNavigationStateParams(navigation).title,
    }),
  },
  [Routes.LEAGUE_CUP]: {
    screen: LeagueCup,
    navigationOptions: ({ navigation }) => ({
      title: getNavigationStateParams(navigation).title,
    }),
  },
});

export const SettingStack = StackNavigator(
  {
    [Routes.SETTINGS]: {
      screen: Settings,
      navigationOptions: {
        title: S.SETTINGS,
      },
    },
    [Routes.SETTINGS_NOTIFICATIONS]: {
      screen: SettingsNotification,
      navigationOptions: {
        title: S.NOTIFICATIONS,
      },
    },
    [Routes.SETTINGS_NOTIFICATIONS_TEAMS]: {
      screen: SettingsNotificationTeams,
      navigationOptions: {
        title: S.SELECT_TEAMS,
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
                  navigationOptions: NavDrawerIcon(S.OVERVIEW),
                },
                [Routes.MY_TEAM]: {
                  screen: MyTeam,
                  navigationOptions: NavDrawerIcon(S.MY_TEAM),
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
                  navigationOptions: ({ navigation }) =>
                    NavDrawerIcon(
                      getNavigationStateParams(navigation) &&
                      getNavigationStateParams(navigation).title
                        ? getNavigationStateParams(navigation).title
                        : S.MATCH,
                    )({ navigation }),
                },
                [Routes.TEAM]: {
                  screen: Team,
                  navigationOptions: ({ navigation }) =>
                    NavDrawerIcon(getNavigationStateParams(navigation).title)({
                      navigation,
                    }),
                },
                [Routes.PLAYER]: {
                  screen: PlayerView,
                  navigationOptions: ({ navigation }) =>
                    NavDrawerIcon(
                      `${getNavigationStateParams(navigation).name} ${
                        getNavigationStateParams(navigation).surname
                      }`,
                    )({ navigation }),
                },
                [Routes.SETTINGS]: {
                  screen: Settings,
                  navigationOptions: NavDrawerIcon(S.SETTINGS),
                },
                [Routes.SETTINGS_NOTIFICATIONS]: {
                  screen: SettingsNotification,
                  navigationOptions: { title: S.NOTIFICATIONS },
                },
                [Routes.SETTINGS_NOTIFICATIONS_TEAMS]: {
                  screen: SettingsNotificationTeams,
                  navigationOptions: { title: S.SELECT_TEAMS },
                },
                [Routes.MATCH_DATE]: {
                  screen: MatchDate,
                  navigationOptions: { title: S.CHANGE_MATCH_DATETIME },
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
              tabBarLabel: S.OVERVIEW,
              tabBarIcon: ({ tintColor }) => NavIcon('football', tintColor),
            },
          },
          [Routes.MY_TEAM]: {
            screen: MyTeamStack,
            navigationOptions: {
              tabBarLabel: S.MY_TEAM,
              tabBarIcon: ({ tintColor }) => NavIcon('shirt', tintColor),
            },
          },
          [Routes.LEAGUES]: {
            screen: LeaguesStack,
            navigationOptions: {
              tabBarLabel: S.GROUPS,
              tabBarIcon: ({ tintColor }) => NavIcon('trophy', tintColor),
            },
          },
          [Routes.SETTINGS]: {
            screen: SettingStack,
            navigationOptions: {
              tabBarLabel: S.SETTINGS,
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

export const SearchStack = StackNavigator(
  {
    SearchStart: {
      screen: Search,
    },
    [Routes.TEAM]: {
      screen: Team,
      navigationOptions: ({ navigation }) => ({
        title: getNavigationStateParams(navigation).title,
      }),
    },
    [Routes.PLAYER]: {
      screen: PlayerView,
      navigationOptions: ({ navigation }) => ({
        title: `${getNavigationStateParams(navigation).name} ${
          getNavigationStateParams(navigation).surname
        }`,
      }),
    },
  },
  SearchHeader,
);

export const Root = StackNavigator(
  {
    [Routes.APP]: { screen: App },
    [Routes.MODAL_LOGIN]: { screen: ModalLogin },
    [Routes.MODAL_SELECT_PLAYER]: { screen: ModalSelectPlayer },
    [Routes.MODAL_FIRST_START]: { screen: FirstStart },
    [Routes.SEARCH]: {
      screen: SearchStack,
    },
  },
  {
    headerMode: 'none',
    mode: 'modal',
    initialRouteName: Routes.APP,
  },
);
