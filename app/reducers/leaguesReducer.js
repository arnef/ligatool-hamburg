import {QUERY_RANKINGS, GET_LEAGUE, FULFILLED, PENDING} from '../actions/types';

export default (state = {
    data: [],
    loading: false,
    error: null
}, action) => {
    switch (action.type) {
        case QUERY_RANKINGS + PENDING:
            state = {...state, loading: true, error: null};
            break;
        case QUERY_RANKINGS + FULFILLED:
            if (action.payload.ok) {
                state = {...state, data: action.payload.data, loading: false, error: null};
            } else {
                state = {...state, loading: false, error: action.payload.problem};
            }
            break;
    }
    return state;
};
