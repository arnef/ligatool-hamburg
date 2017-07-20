// @flow
import { NavigationActions } from 'react-navigation';
import { Root } from '../../router';
import Routes from '../../config/routes';
import { currentRoute } from '../../Helper';

// Type Definitions
type State = {
  navigation: ?any,
  activeItem: string,
};

const routes = [
  Routes.OVERVIEW,
  Routes.MY_TEAM,
  Routes.LEAGUE,
  Routes.LEAGUE_CUP,
  Routes.SETTINGS,
];

// Actions
const SHOW_LOG_IN_MODAL: SHOW_LOG_IN_MODAL =
  'ligatool/modules/SHOW_LOG_IN_MODAL';
export const HIDE_LOG_IN_MODAL: HIDE_LOG_IN_MODAL =
  'ligatool/modules/HIDE_LOG_IN_MODAL';
export const NAVIGATE: NAVIGATE = NavigationActions.NAVIGATE;
export const BACK: BACK = NavigationActions.BACK;
const SHOW_PLAYER_MODAL: SHOW_PLAYER_MODAL =
  'ligatool/modules/navigation/SHOW_PLAYER_MODAL';
const HIDE_PLAYER_MODAL: HIDE_PLAYER_MODAL =
  'ligatool/modules/navigation/HIDE_PLAYER_MODAL';

// Reducer
export default function reducer(
  state: State = { navigation: null, activeItem: Routes.OVERVIEW },
  action: Action,
) {
  switch (action.type) {
    case SHOW_LOG_IN_MODAL:
      state = {
        ...state,
        navigation: Root.router.getStateForAction(
          NavigationActions.navigate({ routeName: Routes.MODAL_LOGIN }),
          state.navigation,
        ),
      };
      break;

    case HIDE_LOG_IN_MODAL:
      state = {
        ...state,
        navigation: Root.router.getStateForAction(
          NavigationActions.back({
            key: findRouteKey(state.navigation, Routes.MODAL_LOGIN),
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
            routeName: Routes.MODAL_SELECT_PLAYER,
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
            key: findRouteKey(state.navigation, Routes.MODAL_SELECT_PLAYER),
          }),
          state.navigation,
        ),
      };
      break;
    case NavigationActions.NAVIGATE:
      state = {
        ...state,
        navigation: Root.router.getStateForAction(action, state.navigation),
      };
      if (routes.indexOf(action.routeName) !== -1 && action.routeName) {
        state.activeItem = action.routeName;
        if (
          action.routeName === Routes.LEAGUE ||
          action.routeName === Routes.LEAGUE_CUP
        ) {
          state.activeItem = `${action.routeName}_${action.params.id}`;
        }
      }
      break;
    case NavigationActions.BACK:
      {
        state = {
          ...state,
          navigation: Root.router.getStateForAction(action, state.navigation),
        };
        const route = currentRoute(state.navigation);
        if (routes.indexOf(Routes.routeName) !== -1) {
          state.activeItem =
            Routes.routeName === Routes.LEAGUE ||
            Routes.routeName === Routes.LEAGUE_CUP
              ? `${Routes.routeName}_${Routes.params.id}`
              : Routes.routeName;
        }
      }
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

// helper
const recursiveFindRoute = (route, name) => {
  if (!route) {
    return null;
  } else if (Routes.routeName == name) {
    return route;
  } else if (!Routes.routes) {
    return null;
  } else {
    for (let i = 0; i < Routes.routes.length; i++) {
      const found = recursiveFindRoute(Routes.routes[i], name);
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
