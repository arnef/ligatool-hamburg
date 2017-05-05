// @flow
import {
  FULFILLED,
  TOKEN,
  SHOW_LOGIN,
  DIALOG_PLAYER
} from '../actions/types';
import { Root } from '../../router';
import { NavigationActions } from 'react-navigation';
import { MODAL_LOGIN, MODAL_SELECT_PLAYER } from '../../views/routes';

export default function (state, action: Action) {
  let nextState = null;
  switch (action.type) {

    case SHOW_LOGIN:
      if (action.payload) {
        nextState = Root.router.getStateForAction(
          NavigationActions.navigate({ routeName: MODAL_LOGIN }),
          state
        );
      } else {
        nextState = Root.router.getStateForAction(
          NavigationActions.back({ key: findRouteKey(state, MODAL_LOGIN) }),
          state
        );
      }
      break;

    case TOKEN + FULFILLED:
      if (action.payload.ok) {
        const key = findRouteKey(state, MODAL_LOGIN);
        if (key) {
          nextState = Root.router.getStateForAction(
            NavigationActions.back({ key }),
            state
          );
        }
      }
      break;

    case DIALOG_PLAYER:
      if (action.payload) {
        nextState = Root.router.getStateForAction(
          NavigationActions.navigate({
            routeName: MODAL_SELECT_PLAYER,
            params: { ...action.payload, team: 'home'}
          }),
          state
        );
      } else {
        nextState = Root.router.getStateForAction(
          NavigationActions.back({ key: findRouteKey(state, MODAL_SELECT_PLAYER)}),
          state
        );
      }
      break;

    default:
      nextState = Root.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
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
