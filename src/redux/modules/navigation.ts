import { NavigationActions } from 'react-navigation';
import { currentRoute } from '../../lib/NavUtils';
import { Screens } from '@app/scenes';
import { Routes } from '@app/scenes/routes';
import { HeaderCloseIcon } from '../../containers/navigation';
const routes = [
  Routes.overview,
  Routes.myTeam,
  Routes.competition,
  Routes.cup,
  Routes.settings,
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

const defaultState = { navigation: null, activeItem: Routes.overview };
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
            routeName: Routes.selectPlayer,
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
            key: findRouteKey(state.navigation, Routes.selectPlayer),
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
            key: findRouteKey(state.navigation, Routes.welcome),
          }),
          state.navigation,
        ),
      };
      break;
    case NavigationActions.NAVIGATE:
      state = {
        ...state,
        navigation: Screens.router.getStateForAction(action, state.navigation),
      };
      if (routes.indexOf(action.routeName) !== -1 && action.routeName) {
        state.activeItem = action.routeName;
        if (
          action.routeName === Routes.competition ||
          action.routeName === Routes.cup
        ) {
          state.activeItem = `${action.routeName}_${action.params.id}`;
        }
      }
      break;
    case NavigationActions.BACK:
      {
        state = {
          ...state,
          navigation: Screens.router.getStateForAction(
            action,
            state.navigation,
          ),
        };
        const route = currentRoute(state.navigation);
        if (routes.indexOf(route.routeName) !== -1) {
          state.activeItem =
            route.routeName === Routes.competition ||
            route.routeName === Routes.cup
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
