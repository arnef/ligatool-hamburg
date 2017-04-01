import { TOKEN, FULFILLED } from '../actions/types'
import Navigator from '../../Navigator'
import { NavigationActions } from 'react-navigation'

const tabs = ['Overview', 'MyTeam', 'Leagues', 'Settings']
let openTab = tabs[0]

export default (state, action) => {
    switch (action.type) {
    // case 'SET_TITLE': {
    //     console.tron.log(action)
    //     const key = findRouteKey(state, action.key)
    //     const title = action.title

    //     return Navigator.router.getStateForAction(
    //         NavigationActions.setParams({ params: { title }, key }),
    //         state
    //     )
    // }
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
            console.tron.log(`route name ${action.routeName}`)
            if (tabs.indexOf(action.routeName) !== -1) {
                console.tron.log(`set open tab ${action.routeName}`)
                openTab = action.routeName
            }
            if (action.routeName === 'Match') {
                const newAction = { ...action, routeName: `${openTab}Match` }

                console.tron.log(`open tab ${openTab}`)
                return Navigator.router.getStateForAction(newAction, state)

            }
        }

        return Navigator.router.getStateForAction(action, state)
    }
    }
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
        console.tron.log('route key ' + found.key)

        return found.key
    }

    return null
}