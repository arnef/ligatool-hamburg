// /**
//  * Copyright (C) 2018 Arne Feil
//  *
//  * This file is part of DTFB App.
//  *
//  * DTFB App is free software: you can redistribute it and/or modify
//  * it under the terms of the GNU General Public License as published by
//  * the Free Software Foundation, either version 3 of the License, or
//  * (at your option) any later version.
//  *
//  * DTFB App is distributed in the hope that it will be useful,
//  * but WITHOUT ANY WARRANTY; without even the implied warranty of
//  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  * GNU General Public License for more details.
//  *
//  * You should have received a copy of the GNU General Public License
//  * along with DTFB App.  If not, see <http://www.gnu.org/licenses/>.
//  *
//  */

export function currentRoute(navigation: any) {
  const rfr = (nav: any): any => {
    const subState =
      nav.routes[nav.index].routeName === 'DrawerOpen'
        ? nav.routes[0]
        : nav.routes[nav.index];

    if (
      !subState.routes ||
      subState.routes[0].routeName.indexOf('TAB_') !== -1
    ) {
      return subState;
    }
    return rfr(subState);
  };

  return rfr(navigation); // || store.getState().nav.navigation);
}

const recursiveFindRoute = (route: any, name: string) => {
  if (!route) {
    return null;
  } else if (route.routeName === name) {
    return route;
  } else if (!route.routes) {
    return null;
  } else {
    for (const r of route.routes) {
      const found: any = recursiveFindRoute(r, name);
      if (found) {
        return found;
      }
    }
  }

  return null;
};

export const findRouteKey = (state: any, name: string) => {
  const found = recursiveFindRoute(state, name);
  if (found) {
    return found.key;
  }

  return null;
};
