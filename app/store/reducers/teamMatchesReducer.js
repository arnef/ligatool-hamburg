import {QUERY_TEAM_MATCHES, PUT_SETS, FULFILLED, PENDING, LOGOUT, SCORE, SUGGEST_SCORE, SCORE_CONFIRMED, NOTIFICATION} from '../actions/types';

const initState = {
    next: [],
    played: [],
    loading: false,
    fetched: false,
    error: null
};

export default (state = initState, action) => {
    let matchId;
    switch (action.type) {
        case QUERY_TEAM_MATCHES + PENDING:
            state = {...state, loading: true};
            break;
        case QUERY_TEAM_MATCHES + FULFILLED:
            if (action.payload.ok) {
                state = {
                    ...state,
                    loading: false,
                    fetched: true,
                    error: null,
                };
                const data = reorderMatches(action.payload.data);
                state.next = data.next;
                state.played = data.played;
            } else {
                state = { ...state, loading: false, error: action.payload.problem };
            }
            break;
        case LOGOUT:
            state = {...initState};
            break;

        case PUT_SETS + FULFILLED:
            if (action.payload.ok) {
                state = {...state};
                for (let i = 0; i < state.next.length; i++) {
                    if (state.next[i].id === action.payload.data.id) {
                        state.next[i] = action.payload.data;
                        break;
                    }
                }
            }
            break;
        case SCORE + NOTIFICATION:
        case SUGGEST_SCORE + NOTIFICATION:
            matchId = parseInt(action.payload.id, 10);
            state = { ...state };
            const data = state.next;
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === matchId) {
                    data[i].set_points_home = parseInt(action.payload.set_points_home, 10);                    
                    data[i].set_points_away = parseInt(action.payload.set_points_away, 10);
                    data[i].live = JSON.parse(action.payload.live);
                    break;
                }
            }
            break;
        case SCORE_CONFIRMED + NOTIFICATION:
            matchId = parseInt(action.payload.id, 10);
            state = { ... state };
            for (let i = 0; i < state.next.length; i++) {
                if (state.next[i].id === matchId) {
                    state.next[i].score_unconfirmed = JSON.parse(action.payload.score_unconfirmed);
                    state.next[i].live = JSON.parse(action.payload.live);
                    break;
                }
            }
            break;
    }

    return state;
}

const reorderMatches = (matches) => {
    const next = [];
    const played = [];
    matches.map((match) => {
        if (match.set_points && !match.score_unconfirmed) {
            played.push(match);
        } else {
            next.push(match);
        }
    });
    return {next: next, played: played};
};