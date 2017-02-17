import { GET_TEAM, FULFILLED, PENDING } from '../actions/types';

const defaultState = {
    id: {},
    loading: false,
    error: null
}

export default (state=defaultState, action) => {
    switch (action.type) {
        case GET_TEAM + PENDING:
            state = { ...state };
            state.loading = true;
            state.error = null;
            break;
        case GET_TEAM + FULFILLED:
            state = { ...state };
            state.loading = false;
            if (action.payload.ok) {
                state.id[`${action.payload.data.id}`] = action.payload.data;
                
            } else {
                state.error = action.payload.problem;
            }
            break;

    }
    return state;
};