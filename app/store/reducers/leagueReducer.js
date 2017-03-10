import { GET_LEAGUE, GET_LEAGUE_MATCHES, PENDING, FULFILLED} from '../actions/types';

export default (state={
    error: null,
    id: {},
    matches: {},
    fetchingID: -1,
    loading: false
}, action) => {
    switch (action.type) {
        case GET_LEAGUE + PENDING:
            state = { ...state, error: null, loading: true };
        break;
        case GET_LEAGUE + FULFILLED:
            state = { ...state, loading: false};
            if (action.payload.ok) {
                const league = action.payload.data;
                state.id[`${league.id}`] = league;
            } else {
                state.error = action.payload.problem;
            }
        break;
        case GET_LEAGUE_MATCHES + PENDING:
            state = { ... state, error: null, loading: true };
            state.fetchingID = action.payload;
            break;
        case GET_LEAGUE_MATCHES + FULFILLED:
            state = { ...state, loading: false };
            if (action.payload.ok) {
                state.matches[state.fetchingID] = action.payload.data;
            } else {
                state.error = action.payload.problem;
            }
            state.fetchingID = -1;
            break;
    }

    return state;
}