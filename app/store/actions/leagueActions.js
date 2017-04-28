import { QUERY_RANKINGS, GET_LEAGUE, GET_LEAGUE_MATCHES } from './types'
import api, { LEAGUES, LEAGUE_BY_ID, LEAGUE_MATCHES} from '../../api'

export const getRankings = () => {
    return {
        payload: api.get(LEAGUES),
        type: QUERY_RANKINGS
    }
}


export const getLeague = (id) => {
    return {
        payload: api.get(LEAGUE_BY_ID(id)),
        type: GET_LEAGUE
    }
}


export const getLeagueMatches = (id) => {
    return {
        payload: {
            data: id,
            promise: api.get(LEAGUE_MATCHES(id))
        },
        type: GET_LEAGUE_MATCHES
    }
}
