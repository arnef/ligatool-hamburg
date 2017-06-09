// @flow
import NotificationManager from '../../NotificationManager';
import { FULFILLED, TOKEN, SHOW_LOGIN, DIALOG_PLAYER } from '../actions/types';
import { Root } from '../../router';
import { NavigationActions } from 'react-navigation';
import {
  MODAL_LOGIN,
  MODAL_SELECT_PLAYER,
  MY_TEAM,
  MATCH,
  OVERVIEW,
  LEAGUE,
  LEAGUE_CUP,
  SETTINGS,
} from '../../views/routes';
import { currentRoute } from '../../Helper';

const routes = [OVERVIEW, MY_TEAM, LEAGUE, LEAGUE_CUP, SETTINGS];

type Routes =
  | typeof OVERVIEW
  | typeof MY_TEAM
  | typeof LEAGUE
  | typeof LEAGUE_CUP
  | typeof SETTINGS
  | string;

type State = {
  navigation: ?any,
  activeItem: Routes,
};

export default function(
  state: State = { navigation: null, activeItem: OVERVIEW },
  action: Action,
) {
  switch (action.type) {
    case SHOW_LOGIN:
      if (action.payload) {
        state = {
          ...state,
          navigation: Root.router.getStateForAction(
            NavigationActions.navigate({ routeName: MODAL_LOGIN }),
            state.navigation,
          ),
        };
      } else {
        state = {
          ...state,
          navigation: Root.router.getStateForAction(
            NavigationActions.back({
              key: findRouteKey(state.navigation, MODAL_LOGIN),
            }),
            state.navigation,
          ),
        };
      }
      break;

    case DIALOG_PLAYER:
      if (action.payload) {
        state = {
          ...state,
          navigation: Root.router.getStateForAction(
            NavigationActions.navigate({
              routeName: MODAL_SELECT_PLAYER,
              params: {
                ...action.payload,
                title: `${action.payload.data.name} Heim`,
                team: 'home',
              },
            }),
            state.navigation,
          ),
        };
      } else {
        state = {
          ...state,
          navigation: Root.router.getStateForAction(
            NavigationActions.back({
              key: findRouteKey(state.navigation, MODAL_SELECT_PLAYER),
            }),
            state.navigation,
          ),
        };
      }
      break;
    case NavigationActions.NAVIGATE:
      if (action.routeName === MATCH && action.params) {
        NotificationManager.removeNotification(action.params.id);
      }
      state = {
        ...state,
        navigation: Root.router.getStateForAction(action, state.navigation),
      };
      if (routes.indexOf(action.routeName) !== -1 && action.routeName) {
        state.activeItem = action.routeName;
        if (action.routeName === LEAGUE || action.routeName === LEAGUE_CUP) {
          state.activeItem = `${action.routeName}_${action.params.id}`;
        }
      }
      break;
    case NavigationActions.BACK: {
      state = {
        ...state,
        navigation: Root.router.getStateForAction(action, state.navigation),
      };
      const route = currentRoute(state.navigation);
      if (routes.indexOf(route.routeName) !== -1) {
        state.activeItem = route.routeName === LEAGUE ||
          route.routeName === LEAGUE_CUP
          ? `${route.routeName}_${route.params.id}`
          : route.routeName;
      }
      break;
    }
    default:
      state = {
        ...state,
        navigation: Root.router.getStateForAction(action, state.navigation),
      };
      break;
  }

  return state;
}

const recursiveFindRoute = (route, name) => {
  if (!route) {
    return null;
  } else if (route.routeName == name) {
    return route;
  } else if (!route.routes) {
    return null;
  } else {
    for (let i = 0; i < route.routes.length; i++) {
      const found = recursiveFindRoute(route.routes[i], name);
      if (found) {
        return found;
      }
    }
  }

  return null;
};

const findRouteKey = (state: any, name: string): any => {
  const found = recursiveFindRoute(state, name);

  if (found) {
    return found.key;
  }

  return null;
};
