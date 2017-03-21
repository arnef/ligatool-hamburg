import {
    SET_TAB,
    PUSH_ROUTE,
    POP_ROUTE,
    SET_TITLE,
    RESET_TO_ROUTE,
    SHOW_LOGIN
} from '../actions/types';
import {
    NavigationExperimental
} from 'react-native';
import * as Routes from '../../views/routes';
import {
    TAB_OVERVIEW,
    TAB_MY_TEAM,
    TAB_LEAGUES,
    TAB_SETTINGS,
    TAB_LOGIN_MODAL
} from '../../views/tabs'
const {
    StateUtils
} = NavigationExperimental;

const initialState = {
    modals: {
        open: false,
        index: 0,
        routes: [
            { key: TAB_LOGIN_MODAL }
        ]
    },
    tabs: {
        index: 0,
        routes: [{
                key: TAB_OVERVIEW
            },
            {
                key: TAB_MY_TEAM
            },
            {
                key: TAB_LEAGUES
            },
            {
                key: TAB_SETTINGS
            }
        ]
    },
    [TAB_OVERVIEW]: {
        index: 0,
        routes: [{
            key: Routes.OVERVIEW,
            state: Routes.OVERVIEW,
            title: 'Übersicht'
        }]
    },
    [TAB_MY_TEAM]: {
        index: 0,
        routes: [{
            key: Routes.MY_TEAM,
            state: Routes.MY_TEAM,
            title: 'Mein Team'
        }]
    },
    [TAB_LEAGUES]: {
        index: 0,
        routes: [{
            key: Routes.LEAGUES,
            state: Routes.LEAGUES,
            title: 'Gruppen'
        }]
    },
    [TAB_SETTINGS]: {
        index: 0,
        routes: [{
            key: Routes.SETTINGS,
            state: Routes.SETTINGS,
            title: 'Einstellungen'
        }]
    },
    [TAB_LOGIN_MODAL]: {
        index: 0,
        routes: [{
            key: Routes.MODAL_SELECT_GROUP,
            state: Routes.MODAL_SELECT_GROUP,
            title: 'Gruppe wählen'
        }]
    }
};

const titles = {};
titles[Routes.OVERVIEW] = 'Übersicht';
titles[Routes.LIVE_MATCH] = 'Begegnung';
titles[Routes.MY_TEAM] = 'Mein Team';
titles[Routes.MATCH] = 'Spiel eintragen';
titles[Routes.LEAGUES] = 'Gruppen';
titles[Routes.SETTINGS] = 'Einstellungen';
titles[Routes.SETTINGS_NOTIFICATION] = 'Gruppen wählen';

export default (state = initialState, action) => {
    switch (action.type) {
        // only for ios
        case SET_TAB: {
            const tabKey = action.tabKey
            const tabs = StateUtils.jumpTo(state.tabs, tabKey)
            if (tabs !== state.tabs) {
                state = { ...state,
                    tabs
                }
            }
            break
        }
        // for android use always the first tab
        case RESET_TO_ROUTE: {
            const {
                tabs
            } = state
            const tabKey = tabs.routes[tabs.index].key
            const route = action.route
            route.key = `${route.state}${route.title}#${state[tabKey].index}`
            const scenes = state[tabKey]
            const nextScenes = StateUtils.reset(scenes, [route])
            state = { ...state,
                [tabKey]: nextScenes
            };
            break
        }
        case SHOW_LOGIN: {
            state = { ...state }
            state.modals.open = action.payload
            // if (action.payload) {
            //     const tabKey = TAB_LOGIN_MODAL
            //     const tabs = StateUtils.jumpTo(state.tabs, tabKey)
            //     console.tron.log(tabs);
            //     if (tabs !== state.tabs) {
            //         state = { ...state, tabs, tabBeforeModal: state.tabs.routes[state.tabs.index].key}
            //     }
            // } else if (state.tabBeforeModal) {
            //     const tabs = StateUtils.jumpTo(state.tabs, state.tabBeforeModal);
            //     if (tabs !== state.tabs) {
            //         state = { ...state, tabs, tabBeforeModal: null }
            //     }
            // }
            break
        }
        case PUSH_ROUTE: {
            const route = action.route
            if (!route.title) {
                route.title = titles[route.state] || ''
            }
            const {
                tabs
            } = state
            const tabKey = tabs.routes[tabs.index].key
            route.key = `${action.route.state}#${state[tabKey].index}`
            const scenes = state[tabKey]
            const nextScenes = StateUtils.push(scenes, route)
            if (scenes !== nextScenes) {
                state = { ...state,
                    [tabKey]: nextScenes
                }
            }
            break
        }
        case POP_ROUTE: {
            const {
                tabs
            } = state
            const tabKey = tabs.routes[tabs.index].key
            const scenes = state[tabKey]
            const nextScenes = StateUtils.pop(scenes)
            if (scenes !== nextScenes) {
                state = { ...state,
                    [tabKey]: nextScenes
                }
            }
            break
        }
        case SET_TITLE: {
            const {
                tabs
            } = state;
            const tabKey = tabs.routes[tabs.index].key
            const scenes = state[tabKey];
            scenes.routes[scenes.index].title = action.title
            state = { ...state,
                [tabKey]: scenes
            }
            break
        }
    }
    return state;
};