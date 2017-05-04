import {
  GET_TEAM,
  QUERY_MY_TEAM_MATCHES,
  QUERY_TEAM_MATCHES,
  SHOW_LOGIN
} from './types';
import store from '../index';
import api, { TEAM_MATCHES, TEAM_BY_ID } from '../../api';

// queryTeamMatches und getTeamMatches zu einer function machen?
export function queryTeamMatches(): Action {
  const team: Team = store.getState().settings.team;
  if (!!team && !!team.id) {
    return {
      payload: api.get(TEAM_MATCHES(team.id)),
      type: QUERY_MY_TEAM_MATCHES
    };
  } else {
    return {
      payload: true,
      type: SHOW_LOGIN
    };
  }
}

export function getTeam(teamID: number): Action {
  return {
    payload: api.get(TEAM_BY_ID(teamID)),
    type: GET_TEAM
  };
}

export function getTeamMatches(teamID: number): Action {
  return {
    payload: api.get(TEAM_MATCHES(teamID), { id: teamID }),
    type: QUERY_TEAM_MATCHES
  };
}
