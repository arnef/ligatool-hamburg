import { GET_TEAM, GET_TEAM_MATCHES , QUERY_TEAM_MATCHES, SHOW_LOGIN } from './types'
import store from '../index'
import api from '../../api'


export const queryTeamMatches = () => {
    const team = store.getState().settings.team

    if (!!team && !!team.id) {
        return {
            payload: api.get('/teams/' + team.id + '/matches'),
            type: QUERY_TEAM_MATCHES
        }
    } else {
        return {
            payload: true,
            type: SHOW_LOGIN
        }
    }
}


export const getTeam = (teamID) => {
    console.tron.log(api.headers)

    return {
        payload: api.get('/teams/' + teamID),
        type: GET_TEAM
    }
}

export const getTeamMatches = (teamID) => {
    return {
        payload: {
            data: teamID,
            promise: api.get('/teams/' + teamID + '/matches')
        },
        type: GET_TEAM_MATCHES
    }
}