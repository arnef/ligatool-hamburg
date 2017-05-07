// @flow
import { QUERY_RANKINGS, GET_LEAGUE, QUERY_LEAGUE_MATCHES } from './types';
import api, { LEAGUES, MATCHES } from '../../api';

export function getRankings(): Action {
  return {
    payload: api.get(LEAGUES),
    type: QUERY_RANKINGS
  };
}

export function getLeague(id: number): Action {
  return {
    payload: api.get(LEAGUES, { id }),
    type: GET_LEAGUE
  };
}

export function getLeagueMatches(id: number): Action {
  return {
    payload: api.get(LEAGUES, { id, route: MATCHES }),
    type: QUERY_LEAGUE_MATCHES
  };
}
