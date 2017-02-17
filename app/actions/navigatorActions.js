import { SET_TOOLBAR_TITLE } from './types';

export const setTitle = (name) => {
    return {
        type: SET_TOOLBAR_TITLE,
        payload: name
    };
};