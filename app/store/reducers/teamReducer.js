import { GET_TEAM, GET_TEAM_MATCHES, FULFILLED, PENDING } from '../actions/types';

const defaultState = {
    id: {},
    pendingID: -1,
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
                if (!state.id[`${action.payload.data.id}`]) {
                    state.id[`${action.payload.data.id}`] = { details: {}, matches: [] };    
                }
                state.id[`${action.payload.data.id}`].details = action.payload.data;
                
            } else {
                state.error = action.payload.problem;
            }
            break;
        
        case GET_TEAM_MATCHES + PENDING:
            state = { ...state, loading: true, error: null, pendingID: action.payload };
            break;
        case GET_TEAM_MATCHES + FULFILLED:
            state = { ...state, loading: false };
            if (action.payload.ok) {
                const teamID = state.pendingID; //TODO get id from response
                if (!state.id[`${teamID}`]) {
                    state.id[`${teamID}`] = { details: {}, matches: [] };    
                }
                state.id[`${teamID}`].matches = action.payload.data;
            } else {
                state.error = action.payload.problem;
            }
            state.pendingID = -1;
            break;

    }
    return state;
};