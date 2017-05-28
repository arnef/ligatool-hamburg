import { Platform } from 'react-native';
import {
  GET_TEAM,
  QUERY_MY_TEAM_MATCHES,
  QUERY_TEAM_MATCHES,
  SHOW_LOGIN,
} from './types';
import store from '../../store';
import * as api from '../../api';
import { ANDROID } from '../../consts';

// queryTeamMatches und getTeamMatches zu einer function machen?
export function queryTeamMatches(): Action {
  const team: Team = store.getState().settings.team;
  if (!!team && !!team.id) {
    return {
      payload: api.getTeamMatches(team.id),
      type: QUERY_MY_TEAM_MATCHES,
    };
  } else {
    return {
      type: Platform.OS === ANDROID ? SHOW_LOGIN : 'IGNORE',
      payload: true,
    };
  }
}

export function getTeam(id: number): Action {
  return {
    payload: api.getTeam(id),
    type: GET_TEAM,
  };
}

export function getTeamMatches(id: number): Action {
  return {
    payload: api.getTeamMatches(id),
    type: QUERY_TEAM_MATCHES,
  };
}
