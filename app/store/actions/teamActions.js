import { GET_TEAM, GET_TEAM_MATCHES , QUERY_TEAM_MATCHES, SHOW_LOGIN } from './types';
import store from '../index';
import api from '../../api';


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

export const getTeamMatches = (teamID) => {
    return {
        type: GET_TEAM_MATCHES,
        payload: {
            data: teamID,
            promise: api.get('/teams/' + teamID + '/matches')
        }
    };
};