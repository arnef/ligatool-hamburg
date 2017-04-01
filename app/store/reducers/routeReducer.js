// import { SET_TAB, PUSH_ROUTE, POP_ROUTE, SET_TITLE, RESET_TO_ROUTE } from '../actions/types'
// import { NavigationExperimental } from 'react-native'
// import * as Routes from '../../views/routes'
// import { TAB_OVERVIEW, TAB_MY_TEAM, TAB_LEAGUES, TAB_SETTINGS } from '../../views/tabs'


// const { StateUtils } = NavigationExperimental

// const initialState = {
//     [TAB_LEAGUES]: {
//         index: 0,
//         routes: [{
//             key: Routes.LEAGUES,
//             state: Routes.LEAGUES,
//             title: 'Gruppen'
//         }]
//     },
//     [TAB_MY_TEAM]: {
//         index: 0,
//         routes: [{
//             key: Routes.MY_TEAM,
//             state: Routes.MY_TEAM,
//             title: 'Mein Team'
//         }]
//     },
//     [TAB_OVERVIEW]: {
//         index: 0,
//         routes: [{
//             key: Routes.OVERVIEW,
//             state: Routes.OVERVIEW,
//             title: 'Übersicht'
//         }]
//     },
//     [TAB_SETTINGS]: {
//         index: 0,
//         routes: [{
//             key: Routes.SETTINGS,
//             state: Routes.SETTINGS,
//             title: 'Einstellungen'
//         }]
//     },
//     tabs: {
//         index: 0,
//         routes: [
//             { key: TAB_OVERVIEW },
//             { key: TAB_MY_TEAM },
//             { key: TAB_LEAGUES },
//             { key: TAB_SETTINGS }
//         ]
//     }
// }

// const titles = {}

// titles[Routes.OVERVIEW] = 'Übersicht'
// titles[Routes.MY_TEAM] = 'Mein Team'
// titles[Routes.MATCH] = 'Begegnung'
// titles[Routes.LEAGUES] = 'Gruppen'
// titles[Routes.SETTINGS] = 'Einstellungen'
// titles[Routes.SETTINGS_NOTIFICATION] = 'Gruppen wählen'

// export default (state = initialState, action) => {
//     switch (action.type) {

//         // only for ios
//     case SET_TAB: {
//         const tabKey = action.tabKey
//         const tabs = StateUtils.jumpTo(state.tabs, tabKey)

//         if (tabs !== state.tabs) {
//             state = { ...state,
//                 tabs
//             }
//         }

//         return state
//     }

//     // for android use always the first tab
//     case RESET_TO_ROUTE: {
//         const { tabs } = state
//         const tabKey = tabs.routes[tabs.index].key
//         const route = action.route

//         route.key = `${route.state}${route.title}#${state[tabKey].index}`
//         const scenes = state[tabKey]
//         const nextScenes = StateUtils.reset(scenes, [route])

//         state = { ...state, [tabKey]: nextScenes }

//         return state
//     }

//     case PUSH_ROUTE: {
//         const route = action.route

//         if (!route.title) {
//             route.title = titles[route.state] || ''
//         }
//         const { tabs } = state
//         const tabKey = tabs.routes[tabs.index].key

//         route.key = `${action.route.state}#${state[tabKey].index}`
//         const scenes = state[tabKey]
//         const nextScenes = StateUtils.push(scenes, route)

//         if (scenes !== nextScenes) {
//             state = { ...state, [tabKey]: nextScenes }
//         }

//         return state
//     }

//     case POP_ROUTE: {
//         const { tabs } = state
//         const tabKey = tabs.routes[tabs.index].key
//         const scenes = state[tabKey]
//         const nextScenes = StateUtils.pop(scenes)

//         if (scenes !== nextScenes) {
//             state = { ...state, [tabKey]: nextScenes }
//         }

//         return state
//     }

//     case SET_TITLE: {
//         const { tabs } = state
//         const tabKey = tabs.routes[tabs.index].key
//         const scenes = state[tabKey]

//         scenes.routes[scenes.index].title = action.title
//         state = { ...state,
//             [tabKey]: scenes
//         }

//         return state
//     }
//     }

//     return state
// }