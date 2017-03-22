import { PUSH_ROUTE, GET_MATCH, FULFILLED, PENDING, SET_PLAYER, PUT_SETS, SCORE, SUGGEST_SCORE, SCORE_CONFIRMED, TOGGLE_D5, NOTIFICATION } from '../actions/types'
import { isAdminForMatch } from '../../Helper'

export default (state = {
    cache: {},
    data: { type: 'default' },
    error: null,
    ignoreNextNotify: false,
    loading: false 
}, action) => {
    switch (action.type) {

        case PUSH_ROUTE: {
            
            if (action.route.state === 'ROUTE.MATCH') {
                const match = action.route.match

                match.type = 'default'
                match.is_admin = isAdminForMatch(match)
                console.tron.log(match)
                state = { ...state, data: match }
            }

            return state
        }

        case GET_MATCH + PENDING: {
            state = { ...state, error: null , loading: true }
            if (state.data.id !== action.payload) {
                const match = state.cache[action.payload] || { type: 'default' }

                state.data = match
            }
            
            return state
        }

        case GET_MATCH + FULFILLED: {
            if (action.payload.ok) {
                const match = action.payload.data
                
                match.type = getMatchType(match)
                match.sets = compaireSets(match, state.cache[match.id])
                match.is_admin = isAdminForMatch(match)
                state = { ...state, data: match, error: null, loading: false }
                state.cache[match.id] = match
            } else {
                state = { ...state, error: action.payload.problem, loading: false }
            }

            return state
        }

        case SET_PLAYER: {
            state = { ...state }
            if (!state.data.sets) {
                state.data.sets = {}
            }
            for (let idx of action.payload.setsIdx) {
                const set = state.data.sets[idx] || {}

                for (let i = 0; i < action.payload.player.length; i++) {
                    set[`player_${i + 1}_${action.payload.team}`] = action.payload.player[i]
                }
                set.number = idx
                state.data.sets[idx] = set
            }
            state.cache[state.data.id] = { ...state.data }
            
            return state
        }

        case PUT_SETS + PENDING: {
            state = { ...state, error: null }
            state.ignoreNextNotify = true
            
            return state
        }

        case PUT_SETS + FULFILLED: {
            state = { ...state, error: null }
            if (action.payload.ok) {
                const match = action.payload.data

                match.type = getMatchType(match)
                match.is_admin = isAdminForMatch(match)
                state.data = match
                state.cache[match.id] = match
            } else {
                state = { ...state, error: action.payload.problem }
            }
            
            return state
        }

        case SCORE + NOTIFICATION:
        case SUGGEST_SCORE + NOTIFICATION: {
            state = { ...state }
            state.ignoreNextNotify = false
            if (state.data.id === parseInt(action.payload.id, 10)) {
                state.data.set_points_home = parseInt(action.payload.set_points_home, 10)
                state.data.set_points_away = parseInt(action.payload.set_points_away, 10)
            }
            
            return state
        }

        case SCORE_CONFIRMED + NOTIFICATION: {
            if (state.data.id === parseInt(action.payload.id, 10)) {
                state = { ...state }
                state.data.score_unconfirmed = JSON.parse(action.payload.score_unconfirmed)
                state.data.live = JSON.parse(action.payload.live)
            }
            
            return state
        }

        case TOGGLE_D5: {
            state = { ...state }
            for(let idx of action.payload.idx) {
                idx = `${idx}`            
                if (state.data.sets[idx]) {
                    state.data.sets[idx].player_1_home = null
                    state.data.sets[idx].player_2_home = null
                    state.data.sets[idx].player_1_away = null
                    state.data.sets[idx].player_2_away = null
                    state.data.sets[idx].goals_home = null
                    state.data.sets[idx].goals_away = null
                }
            }
            state.type = action.payload.type

            return state
        }
    }

    return state
}

const getMatchType = (match) => {
    let type = match.league.cup ? 'cup' : 'default'
    const sets = match.sets || {}

    if (sets['5'] !== null && sets['6'] !== null) {
        if (sets['5'].player_2_home !== null && sets['6'].player_2_away !== null) {
            type += '_d5'
        }
    }

    return type
}

const compaireSets = (match, cacheMatch) => {
    let sets = match.sets

    if (cacheMatch && cacheMatch.sets) {
       for(let nr in cacheMatch.sets) {
            if (!match.sets[nr] && cacheMatch.sets[nr]) {
                sets[nr] = cacheMatch.sets[nr]
            }
        }
    }

    return sets
}
