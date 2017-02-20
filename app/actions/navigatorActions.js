import { SET_TOOLBAR_TITLE, RESET_TO_ROUTE } from './types';

export const setTitle = (name) => {
    return {
        type: SET_TOOLBAR_TITLE,
        payload: name
    };
};

export const resetToRoute = (route) => {
    return {
        type: RESET_TO_ROUTE,
        payload: route
    };
};