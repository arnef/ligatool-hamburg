import { TOKEN, FULFILLED, SHOW_LOGIN, INIT_APP } from '../actions/types'
import Navigator from '../../Navigator'
import { NavigationActions } from 'react-navigation'

const tabs = ['Overview', 'MyTeam', 'Leagues', 'Settings']
const tabRoutes = ['Match', 'Preview', 'Team']

let openTab = tabs[0]

export default (state, action) => {
    switch (action.type) {
    case SHOW_LOGIN: {
        if (action.payload) {
            return Navigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: 'Login' }),
                state
            )
        } else {
            const key = findRouteKey(state, 'Login')

            return Navigator.router.getStateForAction(
                NavigationActions.back({ key }),
                state
            )
        }
    }
    case INIT_APP + FULFILLED: {
        return Navigator.router.getStateForAction(
            NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'App' })
                ]
            }),
            state
        )
    }
    case 'CLOSE_LOGIN_MODAL': {
        const key = findRouteKey(state, 'Login')

        return Navigator.router.getStateForAction(
            NavigationActions.back({ key }),
            state
        )
    }
    case TOKEN + FULFILLED: {
        if (action.payload.ok) {
            const key = findRouteKey(state, 'Login')

            return Navigator.router.getStateForAction(
                NavigationActions.back({ key }),
                state
            )
        }
    }
    default: {
        if (action.type === NavigationActions.NAVIGATE) {
            if (tabs.indexOf(action.routeName) !== -1) {
                console.tron.log(`set open tab ${action.routeName}`)
                openTab = action.routeName
            }

            const idx = tabRoutes.indexOf(action.routeName)
            console.tron.log(action.routeName + ' idx ' + idx)
            if (idx > -1) {
                const newAction = { ...action, routeName: `${openTab}${tabRoutes[idx]}` }

                console.tron.log(newAction)

                return Navigator.router.getStateForAction(newAction, state)
            }
        }

        return Navigator.router.getStateForAction(action, state)
    }
    }
}

const findOpenRoute = (state) => {
    if (state.routes) {
        return findOpenRoute(state.routes[state.index])
    }

    return state
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
        // console.tron.log('route key ' + found.key)

        return found.key
    }

    return null
}