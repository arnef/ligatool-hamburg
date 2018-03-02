import { NavigationActions } from 'react-navigation';
import { Root } from '../../router';
import Routes from '../../config/routes';
import { currentRoute } from '../../lib/NavUtils';

const routes = [
  Routes.OVERVIEW,
  Routes.MY_TEAM,
  Routes.LEAGUE,
  Routes.LEAGUE_CUP,
  Routes.SETTINGS,
];

// Actions
export const SHOW_LOG_IN_MODAL = 'ligatool/SHOW_LOG_IN_MODAL';
export const HIDE_LOG_IN_MODAL = 'ligatool/HIDE_LOG_IN_MODAL';
export const NAVIGATE = NavigationActions.NAVIGATE;
export const BACK = NavigationActions.BACK;
const SHOW_PLAYER_MODAL = 'ligatool/navigation/SHOW_PLAYER_MODAL';
const HIDE_PLAYER_MODAL = 'ligatool/navigation/HIDE_PLAYER_MODAL';
const HIDE_SEARCH = 'ligatool/navigation/HIDE_SEARCH';
export const HIDE_START_MODAL = 'ligatool/navigation/HIDE_START_MODAL';
export const OPEN_MY_TEAM = 'ligatool/navigation/OPEN_MY_TEAM';

const defaultState = { navigation: null, activeItem: Routes.OVERVIEW };
// Reducer
export default function reducer(state = defaultState, action) {
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
    case HIDE_SEARCH:
      state = {
        ...state,
        navigation: Root.router.getStateForAction(
          NavigationActions.back({
            key: findRouteKey(state.navigation, Routes.SEARCH),
          }),
          state.navigation,
        ),
      };
      break;
    case HIDE_START_MODAL:
      state = {
        ...state,
        navigation: Root.router.getStateForAction(
          NavigationActions.back({
            key: findRouteKey(state.navigation, Routes.MODAL_FIRST_START),
          }),
          state.navigation,
        ),
      };
      break;
    case OPEN_MY_TEAM:
      state = {
        ...state,
        activeItem: Routes.MY_TEAM,
        navigation: Root.router.getStateForAction(
          { type: NavigationActions.NAVIGATE, routeName: Routes.MY_TEAM },
          state.navigation,
        ),
      };
      break;
    case NavigationActions.NAVIGATE:
      if (action.routeName !== Routes.MY_TEAM) {
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
      }
      break;
    case NavigationActions.BACK:
      {
        state = {
          ...state,
          navigation: Root.router.getStateForAction(action, state.navigation),
        };
        const route = currentRoute(state.navigation);
        if (routes.indexOf(route.routeName) !== -1) {
          state.activeItem =
            route.routeName === Routes.LEAGUE ||
            route.routeName === Routes.LEAGUE_CUP
              ? `${route.routeName}_${route.params.id}`
              : route.routeName;
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

export function hideLogin(nextRoute) {
  return { type: HIDE_LOG_IN_MODAL, next: nextRoute };
}

export function navigate(data) {
  return NavigationActions.navigate(data);
}

export function setParams(options) {
  return NavigationActions.setParams(options);
}

export function showPlayer(matchId, data) {
  return {
    type: SHOW_PLAYER_MODAL,
    payload: { matchId, data },
  };
}

export const back = () => ({
  type: BACK,
});

export function hideSearch() {
  return { type: HIDE_SEARCH };
}

export function hidePlayer() {
  return { type: HIDE_PLAYER_MODAL };
}

export function hideStart() {
  return { type: HIDE_START_MODAL };
}

// helper
const recursiveFindRoute = (route, name) => {
  if (!route) {
    return null;
  } else if (route.routeName === name) {
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

const findRouteKey = (state, name) => {
  const found = recursiveFindRoute(state, name);
  if (found) {
    return found.key;
  }

  return null;
};
