import { QUERY_RANKINGS, GET_LEAGUE, GET_LEAGUE_MATCHES } from './types'
import api from '../../api'

export const getRankings = () => {
    return {
        payload: api.get('/leagues'),
        type: QUERY_RANKINGS
    }
}


export const getLeague = (id) => {
    return {
        payload: api.get('/leagues/' + id),
        type: GET_LEAGUE
    }
}


export const getLeagueMatches = (id) => {
    return {
        payload: {
            data: id,
            promise: api.get(`/leagues/${id}/matches`)
        },
        type: GET_LEAGUE_MATCHES
    }
}

