// @flow
import { QUERY_RANKINGS, GET_LEAGUE, QUERY_LEAGUE_MATCHES } from './types';
import api, { LEAGUES, LEAGUE_BY_ID, LEAGUE_MATCHES} from '../../api';

export function getRankings (): Action {
    return {
        payload: api.get(LEAGUES),
        type: QUERY_RANKINGS
    };
}


export function getLeague (id: number): Action {
    return {
        payload: api.get(LEAGUE_BY_ID(id)),
        type: GET_LEAGUE
    };
}


export function getLeagueMatches (id: number): Action {
    return {
        payload: api.get(LEAGUE_MATCHES(id), { id }),
        type: QUERY_LEAGUE_MATCHES
    };
}
