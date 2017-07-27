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
