import {
    SET_TAB,
    PUSH_ROUTE,
    POP_ROUTE,
    RESET_TO_ROUTE,
    SET_TITLE
} from './types'

export const setTab = (tabIdx) => {
    return {
        type: SET_TAB,
        tabKey: tabIdx
    }
}


export const pushRoute = (route) => {
    return {
        type: PUSH_ROUTE,
        route
    }
}


export const popRoute = () => {
    return {
        type: POP_ROUTE
    }
}


export const resetToRoute = (route) => {
    return {
        type: RESET_TO_ROUTE,
        route
    }
}


export const setTitle = (title) => {
    return {
        type: SET_TITLE,
        title
    }
}