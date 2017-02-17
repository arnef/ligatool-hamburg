import { GET_LEAGUE, PENDING, FULFILLED} from '../actions/types';

export default (state={
    error: null,
    id: {},
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
    }

    return state;
}