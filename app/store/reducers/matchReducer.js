import {GET_MATCH, FULFILLED, PENDING, SET_PLAYER, PUT_SETS, SCORE, SUGGEST_SCORE, SCORE_CONFIRMED, TOGGLE_D5, NOTIFICATION } from '../actions/types';

export default (state = {
    data: {},
    error: null,
    loading: false,
    ignoreNextNotify: false
}, action) => {
    switch (action.type) {
        case GET_MATCH + PENDING:
            state = {...state, loading: true, error: null};
            if (state.data.id !== action.payload) {
                state.data = {};
            }
            break;
        case GET_MATCH + FULFILLED:
            if (action.payload.ok) {
                state = {...state, loading: false, error: null, data: action.payload.data};
            } else {
                state = {...state, loading: false, error: action.payload.problem};
            }
            break;
        case SET_PLAYER:
            state = {...state};
            if (!state.data.sets) {
                state.data.sets = {};
            }
            for (let idx of action.payload.setsIdx) {
                const set = state.data.sets[idx] || {};
                for (let i = 0; i < action.payload.player.length; i++) {
                    set[`player_${i + 1}_${action.payload.team}`] = action.payload.player[i];
                }
                set.number = idx;
                state.data.sets[idx] = set;
            }
            break;
        case PUT_SETS + PENDING:
            state = { ...state, error: null };
            state.ignoreNextNotify = true;
            break;
        case PUT_SETS + FULFILLED:
            state = {...state, error: null};
            if (action.payload.ok) {
                state.data = action.payload.data;
            } else {
                state = {...state, error: action.payload.problem};
            }
            break;
        case SCORE + NOTIFICATION:
        case SUGGEST_SCORE + NOTIFICATION:
            state = { ...state };
            state.ignoreNextNotify = false;
            if (state.data.id === parseInt(action.payload.id, 10)) {
                
                state.data.set_points_home = parseInt(action.payload.set_points_home, 10);
                state.data.set_points_away = parseInt(action.payload.set_points_away, 10);
                
            }
            break;
        case SCORE_CONFIRMED + NOTIFICATION:
            if (state.data.id === parseInt(action.payload.id, 10)) {
                state = { ...state };
                state.data.score_unconfirmed = JSON.parse(action.payload.score_unconfirmed);
                state.data.live = JSON.parse(action.payload.live);
            }
            break;
        case TOGGLE_D5: 
            state = { ...state };
            for(let idx of action.payload) {
                idx = `${idx}`;
                // delete state.data.sets[idx];                
                if (state.data.sets[idx]) {
                    state.data.sets[idx].player_1_home = null;
                    state.data.sets[idx].player_2_home = null;
                    state.data.sets[idx].player_1_away = null;
                    state.data.sets[idx].player_2_away = null;
                    state.data.sets[idx].goals_home = null;
                    state.data.sets[idx].goals_away = null;
                }
            }
            break;
    }
    return state;
};
