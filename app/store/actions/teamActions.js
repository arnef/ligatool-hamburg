import { GET_TEAM, GET_TEAM_MATCHES , QUERY_TEAM_MATCHES, SHOW_LOGIN } from './types'
import store from '../index'
import api, { TEAM_MATCHES, TEAM_BY_ID } from '../../api'

// queryTeamMatches und getTeamMatches zu einer function machen?
export const queryTeamMatches = () => {
    const team = store.getState().settings.team

    if (!!team && !!team.id) {
        return {
            payload: api.get(TEAM_MATCHES(team.id)),
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
    // console.tron.log(api.headers)

    return {
        payload: api.get(TEAM_BY_ID(teamID)),
        type: GET_TEAM
    }
}

export const getTeamMatches = (teamID) => {
    return {
        payload: {
            data: teamID,
            promise: api.get(TEAM_MATCHES(teamID))
        },
        type: GET_TEAM_MATCHES
    }
}
