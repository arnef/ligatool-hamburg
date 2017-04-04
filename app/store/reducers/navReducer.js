import { TOKEN, FULFILLED, SHOW_LOGIN, DIALOG_PLAYER, INIT_APP, PENDING } from '../actions/types'
import { Platform } from 'react-native'
import { ANDROID } from '../../consts'
import Navigator from '../../Navigator'
import { NavigationActions } from 'react-navigation'

const tabs = ['Overview', 'MyTeam', 'Leagues', 'Settings']
const tabRoutes = ['Match', 'Preview', 'Team']

let openTab = tabs[0]

export default (state, action) => {
    switch (action.type) {
    case DIALOG_PLAYER: {
        if (action.payload) {
            console.tron.log(action.payload)

            return Navigator.router.getStateForAction(
                NavigationActions.navigate({
                    routeName: 'SelectPlayer',
                    params:  { ...action.payload, team: 'home' }
                }),
                state
            )
        } else {
            const key = findRouteKey(state, 'SelectPlayer')

            return Navigator.router.getStateForAction(
                NavigationActions.back({ key }),
                state
            )
        }
    }
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
    // case INIT_APP + PENDING: {
    //     return Navigator.router.getStateForAction(
    //         NavigationActions.init(),
    //         // NavigationActions.reset({
    //         //     index: 0,
    //         //     actions: [
    //         //         NavigationActions.navigate({ routeName: 'Splash' })
    //         //     ]
    //         // }),
    //         state
    //     )
    // }
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
            if (Platform.OS === ANDROID && (action.routeName === 'League' || action.routeName === 'LeagueCupMatches')) {
                openTab = 'Leagues'
            }
            const idx = tabRoutes.indexOf(action.routeName)

            console.tron.log(action.routeName + ' idx ' + idx)
            if (idx > -1) {
                const newAction = { ...action, routeName: `${openTab}${tabRoutes[idx]}` }

                console.tron.log(newAction)

                return Navigator.router.getStateForAction(newAction, state)
            }
        }
        let newState = Navigator.router.getStateForAction(action, state)

        if (Platform.OS === ANDROID && action.type === NavigationActions.BACK) {
            // don't show group overview on android
            if (openTab === 'Leagues' && findOpenRoute(newState).routeName === 'Leagues') {
                newState = Navigator.router.getStateForAction(NavigationActions.back(), newState)
            }
            if (newState === state) {
                // strange android stuff to handle back press close
                newState = { index: 0, routes: [{ routeName: 'Splash', key: 'exit' }] }
                newState.closeApp = true
            }
        }


        return newState
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