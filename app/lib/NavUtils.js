// @flow

export function currentRoute(navigation: any): NavigationRoute {
  const recursiveFindRoute = nav => {
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
    return recursiveFindRoute(subState);
  };

  return recursiveFindRoute(navigation); // || store.getState().nav.navigation);
}

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

export const findRouteKey = (state: any, name: string): any => {
  const found = recursiveFindRoute(state, name);
  if (found) {
    return found.key;
  }

  return null;
};
