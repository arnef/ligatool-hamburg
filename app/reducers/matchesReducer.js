import {QUERY_MATCHES, FULFILLED, REJECTED, PENDING, PUT_SETS, SUGGEST_SCORE, SCORE_CONFIRMED, SCORE, NOTIFICATION, TOGGLE_D5 } from '../actions/types';
import {compareDays} from '../Helper';

export default (state = {
    today: [],
    next: [],
    played: [],
    error: null,
    fetching: false
}, action) => {
    let matchId;
    switch (action.type) {
        case QUERY_MATCHES + PENDING:
            state = {...state, fetching: true, error: null };
            break;
        case QUERY_MATCHES + FULFILLED:
            state = { ...state, fetching: false };
            if (action.payload.ok) {
                const newState = reorderMatches(action.payload.data);
                state.today = newState.today;
                state.next = newState.next;
                state.played = newState.played;
            } else {
                state.error = action.payload.problem;
            }
            break;

        case PUT_SETS + FULFILLED:
            if (action.payload.ok) {
                state = {...state};
                for (let i = 0; i < state.today.length; i++) {
                    if (state.today[i].id === action.payload.data.id) {
                        state.today[i] = action.payload.data;
                        break;
                    }
                }
            }
            break;
        case SCORE + NOTIFICATION:
        case SUGGEST_SCORE + NOTIFICATION:
            matchId = parseInt(action.payload.id, 10);
            state = { ...state };
            const data = state.today;
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
            let skipPlayed = false;
            for (let i = 0; i < state.today.length; i++) {
                if (state.today[i].id === matchId) {
                    state.today[i].score_unconfirmed = JSON.parse(action.payload.score_unconfirmed);
                    state.today[i].live = JSON.parse(action.payload.live);
                    skipPlayed = true;
                    break;
                }
            }
            console.tron.log('skilp played ' + skipPlayed);
            if (!skipPlayed) {
                for (let i = 0; i < state.played.length; i++) {
                    if (state.played[i].id === matchId) {
                        state.played[i].score_unconfirmed = JSON.parse(action.payload.score_unconfirmed);
                        state.played[i].live = JSON.parse(action.payload.live);
                        break;
                    }
                }
            }
            break;
    }
    return state;
};

const reorderMatches = (matches) => {
    let today = [];
    const next = [];
    const played = [];
    
    const now = new Date().getTime();
    matches.map((match) => {
        const diff = compareDays(match.datetime, now);
        if (match.live || diff === 0) {
            console.tron.log(`time diff ${diff}`);
            today.push(match);
        } else if (diff < 0) {
            if (match.set_points) {
                played.push(match);
            }
        } else if (diff > 0) {
            next.push(match);
        }
        
    });
    today.sort(sortMatches);
    next.sort(sortMatches);
    played.sort((a, b) => {
        let order = b.datetime-a.datetime;
    if (order === 0) {
        order = a.league.name < b.league.name ? -1 : 1;
    } 
    return order;
    });
    return {
        today,
        next,
        played
    };
};

const sortMatches = (a, b) => {
    let order = a.datetime-b.datetime;
    if (order === 0) {
        order = a.league.name < b.league.name ? -1 : 1;
    } 
    return order;
};