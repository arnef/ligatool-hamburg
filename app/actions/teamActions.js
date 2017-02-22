import { SET_TEAMS, GET_TEAM, QUERY_TEAM_MATCHES, SHOW_LOGIN } from './types';
import store from '../store';
import api from '../api';

export const setTeams = (teams) => {
	return {
		type: SET_TEAMS,
		payload: teams
	};
};


export const queryTeamMatches = () => {
    const team = store.getState().settings.team;
    if (!!team && !!team.id) {
        return {
            type: QUERY_TEAM_MATCHES,
            payload: api.get('/teams/' + team.id + '/matches')
        };
    } else {
        return {
            type: SHOW_LOGIN,
            payload: true
        };
    }
};


export const getTeam = (teamID) => {
    console.tron.log(api.headers);
    return {
        type: GET_TEAM,
        payload: api.get('/teams/' + teamID)
    };
};