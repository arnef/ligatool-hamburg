// @flow
import {
  QUERY_RANKINGS,
  GET_LEAGUE,
  QUERY_LEAGUE_MATCHES,
  GET_PLAYERS_STATS,
} from './types';
import api, { LEAGUES, MATCHES, PLAYER } from '../../api';

export function getRankings(): Action {
  return {
    payload: api.get(LEAGUES),
    type: QUERY_RANKINGS,
  };
}

export function getLeague(id: number): Action {
  return {
    payload: api.get(LEAGUES, { id }),
    type: GET_LEAGUE,
  };
}

export function getLeagueMatches(id: number): Action {
  return {
    payload: api.get(LEAGUES, { id, route: MATCHES }),
    type: QUERY_LEAGUE_MATCHES,
  };
}

export function getPlayersStats(id: number): Action {
  return {
    type: GET_PLAYERS_STATS,
    payload: api.get(LEAGUES, { id, route: PLAYER }),
  };
}
