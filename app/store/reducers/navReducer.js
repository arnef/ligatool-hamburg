import { TOKEN, FULFILLED } from '../actions/types'
import Navigator from '../../Navigator'
import { NavigationActions } from 'react-navigation'

export default (state, action) => {
    switch (action.type) {
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

        return Navigator.router.getStateForAction(action, state)
    }
    }
}


const recursiveFindRoute = (route, name) => {
    if (route) {
        console.tron.log(`route Name: ${route.routeName}`)
    }
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
        return found.key
    }

    return null
}