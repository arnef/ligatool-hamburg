/* @flow */
import { TOKEN, FULFILLED, SHOW_LOGIN, DIALOG_PLAYER, INIT_APP } from '../actions/types'
import { Platform } from 'react-native'
import { ANDROID } from '../../consts'
import Navigator from '../../Navigator'
import { NavigationActions } from 'react-navigation'

const tabs = [
  Route.OVERVIEW_NAVIGATOR,
  Route.MY_TEAM_NAVIGATOR,
  Route.LEAGUES_NAVIGATOR,
  Route.SETTINGS_NAVIGATOR
];
const tabRoutes = [ Route.MATCH, Route.PREVIEW, Route.TEAM ];
const initialRoute = { routeName: Route.OVERVIEW_NAVIGATOR };

import * as Route from '../../views/routes'

export default (nav={
  state: null,
  actionStack: [],
  currentRoute: initialRoute,
  drawerOpen: false,
  modalOpen: false,
  actionStacks: {
    tabs: []
  },
  currentTab: Route.OVERVIEW_NAVIGATOR //TODO rename to currentNavigator?
}, action) => {
  switch (action.type) {
  case DIALOG_PLAYER: {
      nav = { ...nav }
      if (action.payload) {
          nav.state =
              Navigator.router.getStateForAction(
                  NavigationActions.navigate({
                      routeName: Route.MODAL_SELECT_PLAYER,
                      params:  { ...action.payload, team: 'home' }
                  }),
                  nav.state
              )
      } else {
          const key = findRouteKey(nav.state, Route.MODAL_SELECT_PLAYER)

          nav.state =
              Navigator.router.getStateForAction(
                  NavigationActions.back({ key }),
                  nav.state
              )

      }
      nav.modalOpen = action.payload ? true : false

      return nav
  }
  case SHOW_LOGIN: {
      nav = { ...nav }

      if (action.payload) {
          nav.state = Navigator.router.getStateForAction(
              NavigationActions.navigate({ routeName: Route.MODAL_LOGIN }),
              nav.state
          )
      } else {
          const key = findRouteKey(nav.state, Route.MODAL_LOGIN)

          nav.state = Navigator.router.getStateForAction(
              NavigationActions.back({ key }),
              nav.state
          )
      }
      nav.modalOpen = action.payload ? true : false

      return nav
  }
  case INIT_APP + FULFILLED: {
      nav = { ...nav }
      const action = Platform.OS === ANDROID ?
          NavigationActions.navigate({ routeName: Route.APP })
      :   NavigationActions.reset({
          index: 0,
          actions: [ NavigationActions.navigate({ routeName: Route.APP })]
      })

      nav.state = Navigator.router.getStateForAction(action, nav.state)

      //
      if (nav.actionStack.length > 0) {
          nav.actionStack.map(action => {
              nav.state = Navigator.router.getStateForAction(
                  action, nav.state
              )
          })
      }

      return nav
  }
  case TOKEN + FULFILLED: {
      if (action.payload.ok) {
          const key = findRouteKey(nav.state, Route.MODAL_LOGIN)

          nav =  { ...nav }
          nav.state = Navigator.router.getStateForAction(
              NavigationActions.back({ key }),
              nav.state
          )
          nav.modalOpen = false
      }

      return nav
  }
  case NavigationActions.NAVIGATE: {
    const tab = nav.currentTab.indexOf(Route.LEAGUE) === -1 ? nav.currentTab : Route.LEAGUES_NAVIGATOR;
    const idx = tabRoutes.indexOf(action.routeName);

    const newAction = idx > -1 ? { ...action, routeName: `${tab}${tabRoutes[idx]}` }
        : { ...action }
    console.tron.log(newAction);
    nav = { ...nav }
    if (Platform.OS === ANDROID && (newAction.routeName === Route.LEAGUE || newAction.routeName === Route.LEAGUE_CUP)) {
        nav.currentTab = newAction.routeName; //Route.LEAGUES_NAVIGATOR;
        nav.actionStacks.tabs.push(newAction);
    } else
    if (tabs.indexOf(newAction.routeName) !== -1) {
        nav.currentTab = newAction.routeName;
        nav.actionStacks.tabs.push(newAction);

    } else if (action.routeName.indexOf('Drawer') === -1 && !nav.modalOpen) {
      if (action.routeName.indexOf('TAB_') === -1) {
        if (!nav.actionStacks[nav.currentTab]) {
          nav.actionStacks[nav.currentTab] = [];
        }
        nav.actionStacks[nav.currentTab].push(newAction);
        nav.currentRoute = { routeName: newAction.routeName, params: newAction.params };
      }
    } else {
        nav.drawerOpen = newAction.routeName === 'DrawerOpen'
    }

    nav.state = Navigator.router.getStateForAction(newAction, nav.state)

    return nav
  }
  case NavigationActions.BACK: {
    if (Platform.OS === ANDROID) {
      nav = { ...nav }

      // if (nav.actionStack.length > 0 && !nav.drawerOpen && !nav.modalOpen) {
      //     const lastAction = nav.actionStack.pop()
      //     const key = findRouteKey(nav.state, lastAction.routeName)
      //     const currentRoute = getCurrentRoute(nav)
      //
      //     if (Platform.OS === ANDROID && ( lastAction.routeName === Route.LEAGUE ||
      //         lastAction.routeName === Route.LEAGUE_CUP) ) {
      //           console.tron.log('replace route');
      //         nav.state = Navigator.router.getStateForAction(
      //             NavigationActions.navigate(currentRoute),
      //             nav.state
      //         )
      //     } else {
      //       console.tron.log('go back to key');
      //         nav.state = Navigator.router.getStateForAction(
      //         NavigationActions.back({ key }), nav.state)
      //     }
      //     nav.currentRoute = currentRoute
      if (!nav.drawerOpen && !nav.modalOpen) {
        if (nav.actionStacks[nav.currentTab] && nav.actionStacks[nav.currentTab].length > 0) {
          console.tron.log('go back in current tab navigator');
          nav.actionStacks[nav.currentTab].pop();
          nav.state = Navigator.router.getStateForAction(NavigationActions.back(), nav.state);

        } else {
          console.tron.log('go back in tab stack');
          nav.actionStacks.tabs.pop();
          let prevTab = initialRoute;
          if (nav.actionStacks.tabs.length > 0) {
            prevTab = nav.actionStacks.tabs[nav.actionStacks.tabs.length - 1];
            console.tron.log(prevTab);
            nav.currentTab  = prevTab.routeName;
          }

          nav.state = Navigator.router.getStateForAction(NavigationActions.navigate(prevTab), nav.state);
        }
      } else {
        console.tron.log('go default back');
          nav.state = Navigator.router.getStateForAction(NavigationActions.back(), nav.state)
      }
      nav.drawerOpen = false

      return nav
      }
  }
  default: {
      nav = { ...nav }
      nav.state = Navigator.router.getStateForAction(action, nav.state)

      return nav
  }
  }
}

const currentRoute = (nav) => {
  const subState = nav.routes[nav.index];
  if (!subState.routes) {
    return subState;
  }
  return currentRoute(subState);
};

const getCurrentRoute = (nav) => {
  const idx = nav.actionStack.length - 1

  return nav.actionStack[idx] || initialRoute
}


const recursiveFindRoute = (route, name) => {
  if (!route) {
      return null
  }
  else if (route.routeName == name) {
      return route
  }
  else if (!route.routes) {
      return null
  }
  else {
      for (let i=0; i<route.routes.length; i++) {
          const found = recursiveFindRoute(route.routes[i], name)

          if (found) {
              return found
          }
      }
  }

  return null
}

const findRouteKey = (state: any, name: string): any => {
  const found = recursiveFindRoute(state, name)

  if (found) {
      console.tron.log(found)

      return found.key
  }

  return null
}
