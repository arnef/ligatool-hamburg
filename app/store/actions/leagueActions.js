// @flow
import {
  QUERY_RANKINGS,
  GET_LEAGUE,
  QUERY_LEAGUE_MATCHES,
  GET_PLAYERS_STATS,
} from './types';
import * as api from '../../api';

export function getRankings(): Action {
  return {
    payload: api.getLeagues(),
    type: QUERY_RANKINGS,
  };
}

export function getLeague(id: number): Action {
  return {
    payload: api.getLeague(id),
    type: GET_LEAGUE,
  };
}

export function getLeagueMatches(id: number): Action {
  return {
    payload: api.getLeagueMatches(id),
    type: QUERY_LEAGUE_MATCHES,
  };
}

export function getPlayersStats(id: number): Action {
  return {
    type: GET_PLAYERS_STATS,
    payload: api.getLeaguePlayerRanking(id),
  };
}
