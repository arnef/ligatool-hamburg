import {LOAD_ACCESS_KEY, LOAD_TOKEN, LOAD_SETTINGS, TOKEN, FULFILLED, PENDING } from '../actions/types';

export default (state = {
    renewToken: false,
    tasks: 3,
    tasksDone: []
}, action) => {
    switch (action.type) {
        
        case LOAD_ACCESS_KEY + FULFILLED:
        case LOAD_SETTINGS +  FULFILLED:
            state = {...state };
            if (state.tasksDone.length === state.tasks) {
                state.tasksDone = [];
            }
            state.tasksDone.push(action.type);
            break;
        case LOAD_TOKEN + FULFILLED:
            state = { ...state };
            state.tasksDone.push(action.type);
            if (action.payload.ok && action.payload.data.expires < (new Date()).getTime()) {
                state.renewToken = true;
                state.tasks = 4;
            }
            break;
        case TOKEN + PENDING:
            state = { ...state };
            break;
        case TOKEN + FULFILLED:
            if (state.renewToken) {
                state = { ...state };
                state.renewToken = false;
                state.tasksDone.push(action.type);
            }
            break;
    }
    return state;
};
