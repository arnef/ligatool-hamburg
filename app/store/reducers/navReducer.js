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
]
const tabRoutes = [ Route.MATCH, Route.PREVIEW, Route.TEAM ]

const topTabRoutes = ['Live', 'Next', 'Comming', 'Played']
const initialRoute = { routeName: Route.OVERVIEW_NAVIGATOR }
import * as Route from '../../views/routes'

export default (nav={
  state: null,
  actionStack: [],
  currentRoute: initialRoute,
  drawerOpen: false,
  modalOpen: false,
  currentTab: Route.OVERVIEW_NAVIGATOR //TODO rename to currentNavigator?
}, action) => {
  switch (action.type) {
  case DIALOG_PLAYER: {
      nav = { ...nav }
      if (action.payload) {
          console.tron.log(action.payload)
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
      const idx = tabRoutes.indexOf(action.routeName)
      const newAction = idx > -1 ? { ...action, routeName: `${nav.currentTab}${tabRoutes[idx]}` }
          : { ...action }

      nav = { ...nav }

      console.tron.log(newAction)

      if (action.routeName.indexOf('Drawer') === -1 && !nav.modalOpen) {
        if (action.routeName.indexOf('TAB_') === -1) {
          nav.actionStack.push(newAction);
          nav.currentRoute = { routeName: newAction.routeName, params: newAction.params };
        }
      } else {
          nav.drawerOpen = newAction.routeName === 'DrawerOpen'
      }

      if (tabs.indexOf(newAction.routeName) !== -1) {
          nav.currentTab = newAction.routeName
      }
      if (Platform.OS === ANDROID && (newAction.routeName === Route.LEAGUE || newAction.routeName === Route.LEAGUE_CUP)) {
          nav.currentTab = Route.LEAGUES_NAVIGATOR;
      }

      nav.state = Navigator.router.getStateForAction(newAction, nav.state)

      return nav
  }
  case NavigationActions.BACK: {
      nav = { ...nav }
      if (nav.actionStack.length > 0 && !nav.drawerOpen && !nav.modalOpen) {
          const lastAction = nav.actionStack.pop()
          const key = findRouteKey(nav.state, lastAction.routeName)
          const currentRoute = getCurrentRoute(nav)

          if (Platform.OS === ANDROID && ( lastAction.routeName === Route.LEAGUE ||
              lastAction.routeName === Route.LEAGUE_CUP) ) {

              nav.state = Navigator.router.getStateForAction(
                  NavigationActions.navigate(currentRoute),
                  nav.state
              )
          } else {
              nav.state = Navigator.router.getStateForAction(
              NavigationActions.back({ key }), nav.state)
          }

          nav.currentRoute = currentRoute

      } else {
          nav.state = Navigator.router.getStateForAction(action, nav.state)
      }
      nav.drawerOpen = false

      return nav
  }
  default: {
      nav = { ...nav }
      nav.state = Navigator.router.getStateForAction(action, nav.state)

      return nav
  }
  }
}

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

const findRouteKey = (state, name) => {
  const found = recursiveFindRoute(state, name)

  if (found) {
      console.tron.log(found)

      return found.key
  }

  return null
}
