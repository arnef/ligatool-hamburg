import { SET_TAB, PUSH_ROUTE, POP_ROUTE, RESET_TO_ROUTE, SET_TITLE } from './types'

export const setTab = (tabIdx) => {
    return {
        tabKey: tabIdx,
        type: SET_TAB
    }
}


export const pushRoute = (route) => {
    return {
        route,
        type: PUSH_ROUTE
    }
}


export const popRoute = () => {
    return {
        type: POP_ROUTE
    }
}


export const resetToRoute = (route) => {
    return {
        route,
        type: RESET_TO_ROUTE
    }
}


export const setTitle = (title) => {
    return {
        title,
        type: SET_TITLE
    }
}