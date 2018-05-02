import { NavigationActions } from 'react-navigation';
// import { Root } from '../../router';
import RoutesOld from '../../config/routes';
import { currentRoute } from '../../lib/NavUtils';
import { Screens } from 'src/scenes';
import { Routes } from 'src/scenes/routes';
const routes = [
  RoutesOld.OVERVIEW,
  RoutesOld.MY_TEAM,
  RoutesOld.LEAGUE,
  RoutesOld.LEAGUE_CUP,
  RoutesOld.SETTINGS,
];

// Actions
export const SHOW_LOG_IN_MODAL = 'ligatool/SHOW_LOG_IN_MODAL';
export const HIDE_LOG_IN_MODAL = 'ligatool/HIDE_LOG_IN_MODAL';
export const NAVIGATE = NavigationActions.NAVIGATE;
export const BACK = NavigationActions.BACK;
const SHOW_PLAYER_MODAL = 'ligatool/navigation/SHOW_PLAYER_MODAL';
export const HIDE_PLAYER_MODAL = 'ligatool/navigation/HIDE_PLAYER_MODAL';
const HIDE_SEARCH = 'ligatool/navigation/HIDE_SEARCH';
export const HIDE_START_MODAL = 'ligatool/navigation/HIDE_START_MODAL';
export const OPEN_MY_TEAM = 'ligatool/navigation/OPEN_MY_TEAM';

const defaultState = { navigation: null, activeItem: RoutesOld.OVERVIEW };
// Reducer
export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case SHOW_LOG_IN_MODAL:
      state = {
        ...state,
        navigation: Screens.router.getStateForAction(
          NavigationActions.navigate({ routeName: Routes.selectCompetition }),
          state.navigation,
        ),
      };
      break;

    case SHOW_PLAYER_MODAL:
      state = {
        ...state,
        navigation: Screens.router.getStateForAction(
          NavigationActions.navigate({
            routeName: RoutesOld.MODAL_SELECT_PLAYER,
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
        navigation: Screens.router.getStateForAction(
          NavigationActions.back({
            key: findRouteKey(state.navigation, RoutesOld.MODAL_SELECT_PLAYER),
          }),
          state.navigation,
        ),
      };
      break;
    case HIDE_SEARCH:
      state = {
        ...state,
        navigation: Screens.router.getStateForAction(
          NavigationActions.back({
            key: findRouteKey(state.navigation, RoutesOld.SEARCH),
          }),
          state.navigation,
        ),
      };
      break;
    case HIDE_START_MODAL:
      state = {
        ...state,
        navigation: Screens.router.getStateForAction(
          NavigationActions.back({
            key: findRouteKey(state.navigation, RoutesOld.MODAL_FIRST_START),
          }),
          state.navigation,
        ),
      };
      break;
    case OPEN_MY_TEAM:
      state = {
        ...state,
        activeItem: RoutesOld.MY_TEAM,
        navigation: Screens.router.getStateForAction(
          { type: NavigationActions.NAVIGATE, routeName: RoutesOld.MY_TEAM },
          state.navigation,
        ),
      };
      break;
    case NavigationActions.NAVIGATE:
      if (action.routeName !== RoutesOld.MY_TEAM) {
        state = {
          ...state,
          navigation: Screens.router.getStateForAction(action, state.navigation),
        };
        if (routes.indexOf(action.routeName) !== -1 && action.routeName) {
          state.activeItem = action.routeName;
          if (
            action.routeName === RoutesOld.LEAGUE ||
            action.routeName === RoutesOld.LEAGUE_CUP
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
          navigation: Screens.router.getStateForAction(action, state.navigation),
        };
        const route = currentRoute(state.navigation);
        if (routes.indexOf(route.routeName) !== -1) {
          state.activeItem =
            route.routeName === RoutesOld.LEAGUE ||
            route.routeName === RoutesOld.LEAGUE_CUP
              ? `${route.routeName}_${route.params.id}`
              : route.routeName;
        }
      }
      break;

    default:
      state = {
        ...state,
        navigation: Screens.router.getStateForAction(action, state.navigation),
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

/* selectors */
export const getNavigationStateParams = navigation =>
  navigation.state && navigation.state.params ? navigation.state.params : null;

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
