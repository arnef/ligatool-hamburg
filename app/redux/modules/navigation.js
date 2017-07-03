// @flow
import { NavigationActions } from 'react-navigation';
import { Root } from '../../router';
import {
  MODAL_LOGIN,
  MODAL_SELECT_PLAYER,
  MY_TEAM,
  // MATCH,
  OVERVIEW,
  LEAGUE,
  LEAGUE_CUP,
  SETTINGS,
} from '../../views/routes';

// Type Definitions
// const routes = [OVERVIEW, MY_TEAM, LEAGUE, LEAGUE_CUP, SETTINGS];

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
// Actions
const SHOW_LOG_IN_MODAL: SHOW_LOG_IN_MODAL =
  'ligatool/modules/SHOW_LOG_IN_MODAL';
export const HIDE_LOG_IN_MODAL: HIDE_LOG_IN_MODAL =
  'ligatool/modules/HIDE_LOG_IN_MODAL';
const SHOW_PLAYER_MODAL: SHOW_PLAYER_MODAL =
  'ligatool/modules/navigation/SHOW_PLAYER_MODAL';
const HIDE_PLAYER_MODAL: HIDE_PLAYER_MODAL =
  'ligatool/modules/navigation/HIDE_PLAYER_MODAL';

// Reducer
export default function reducer(
  state: State = { navigation: null, activeItem: OVERVIEW },
  action: Action,
) {
  switch (action.type) {
    case SHOW_LOG_IN_MODAL:
      state = {
        ...state,
        navigation: Root.router.getStateForAction(
          NavigationActions.navigate({ routeName: MODAL_LOGIN }),
          state.navigation,
        ),
      };
      break;

    case HIDE_LOG_IN_MODAL:
      state = {
        ...state,
        navigation: Root.router.getStateForAction(
          NavigationActions.back({
            key: findRouteKey(state.navigation, MODAL_LOGIN),
          }),
          state.navigation,
        ),
      };
      break;

    case SHOW_PLAYER_MODAL:
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
      break;
    case HIDE_PLAYER_MODAL:
      state = {
        ...state,
        navigation: Root.router.getStateForAction(
          NavigationActions.back({
            key: findRouteKey(state.navigation, MODAL_SELECT_PLAYER),
          }),
          state.navigation,
        ),
      };
      break;

    default:
      state = {
        ...state,
        navigation: Root.router.getStateForAction(action, state.navigation),
      };
      break;
  }

  return state;
}

// Action Creators
export function showLogin() {
  return { type: SHOW_LOG_IN_MODAL };
}

export function hideLogin(nextRoute: ?string) {
  return { type: HIDE_LOG_IN_MODAL, next: nextRoute };
}

export function navigate(data: any) {
  return NavigationActions.navigate(data);
}

export function showPlayer(matchId: number, data: Array<Player>): Action {
  return {
    type: SHOW_PLAYER_MODAL,
    payload: { matchId, data },
  };
}

export function hidePlayer() {
  return { type: HIDE_PLAYER_MODAL };
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
