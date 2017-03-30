import { QUERY_MATCHES, GET_MATCH, SET_PLAYER, PUT_SETS, TOGGLE_D5 } from './types'
import api from '../../api'


export const queryMatches = () => {
    return {
        payload: api.get('/matches'),
        type: QUERY_MATCHES
    }
}

export const getMatch = (id) => {
    console.tron.log('action get match fired')

    return {
        payload: {
            data: id,
            promise: api.get('/matches/' + id)
        },
        type: GET_MATCH
    }
}

export const setPlayer = (id, team, player, setsIdx) => {
    return {
        payload: { id, player, setsIdx, team },
        type: SET_PLAYER
    }
}

export const updateSets = (matchId, sets) =>  {
    return {
        payload: api.put('/matches/'+matchId, { sets } ),
        type: PUT_SETS
    }
}

export const suggestScore = (matchId, sets, type) => {
    if (type === 1) {
        throw 'Wrong type for suggestScore action, must be 0 or 2'
    }
    const action = type === 0 ? { score_suggest: true } : { score_unconfirmed: false }
    const body = { sets, ...action }

    return {
        payload: api.put('/matches/'+ matchId, body),
        type: PUT_SETS
    }
}

export const toggleMatchType = (id, setsIdx, type) => {
    return {
        payload: { id, idx: setsIdx, type },
        type: TOGGLE_D5
    }
}