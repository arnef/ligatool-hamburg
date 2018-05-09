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

import { currentRoute } from '@app/lib/NavUtils';
import { Screens } from '@app/scenes';
import { Routes } from '@app/scenes/routes';
import { NavigationActions } from 'react-navigation';
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

export interface INavigationState {
  navigation?: any;
  activeItem: string;
}
const defaultState: INavigationState = {
  activeItem: Routes.overview,
  navigation: null,
};
// Reducer
export default function reducer(
  state: INavigationState = defaultState,
  action: any,
) {
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
            params: {
              ...action.payload,
              team: 'home',
              title: `${action.payload.data.name} Heim`,
            },
            routeName: Routes.selectPlayer,
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

export function hideLogin(nextRoute: any) {
  return { type: HIDE_LOG_IN_MODAL, next: nextRoute };
}

export function navigate(data: any) {
  return NavigationActions.navigate(data);
}

export function setParams(options: any) {
  return NavigationActions.setParams(options);
}

export function showPlayer(matchId: string, data: any) {
  return {
    payload: { matchId, data },
    type: SHOW_PLAYER_MODAL,
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
export const getNavigationStateParams = (navigation: any) =>
  navigation.state && navigation.state.params ? navigation.state.params : null;

// helper
const recursiveFindRoute = (route: any, name: string) => {
  if (!route) {
    return null;
  } else if (route.routeName === name) {
    return route;
  } else if (!route.routes) {
    return null;
  } else {
    for (const r of route.routes) {
      const found: string = recursiveFindRoute(r, name);
      if (found) {
        return found;
      }
    }
  }

  return null;
};

const findRouteKey = (state: any, name: string): string => {
  const found = recursiveFindRoute(state, name);
  if (found) {
    return found.key;
  }

  return null;
};
