// @flow
import {
  OVERVIEW,
  MY_TEAM,
  LEAGUE,
  LEAGUE_CUP,
  SETTINGS
} from '../../views/routes';
import { NavigationActions } from 'react-navigation';
import { currentRoute } from '../../Helper';

const routes = [OVERVIEW, MY_TEAM, LEAGUE, LEAGUE_CUP, SETTINGS];

export default function(state=OVERVIEW, action: Action) {
  switch (action.type) {
    case 'UPDATE_DRAWER_ITEM':
    case NavigationActions.NAVIGATE:
      const route = action.type === NavigationActions.NAVIGATE
        ? action
        : currentRoute();
      if (routes.indexOf(route.routeName) !== -1) {
        state = route.routeName;
        if (route.routeName === LEAGUE || route.routeName === LEAGUE_CUP) {
          state = `${route.routeName}_${route.params.id}`;
        }
      }
      break;
  }
  return state;
}
