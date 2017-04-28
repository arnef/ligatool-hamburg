/* @flow */
import { create } from 'apisauce'

export const baseUrl = __DEV__ ?
    'http://192.168.0.164/liga-tool' :
    // 'http://192.168.1.9/liga-tool' :
    'https://kickern-hamburg.de/de/competitions'


const api = create({
    baseURL: `${baseUrl}/index.php?option=com_sportsmanagerapi&q=`
})

if (__DEV__) {
    api.addMonitor(response => {
        console.tron.apisauce(response)
    })
}

export default api

// export routes
export const USER_AUTH: string = '/user/auth';
export const USER_AUTH_REFRESH: string = USER_AUTH + '/refresh';
export const NOTIFICATION: string = '/notification';
export const LEAGUES: string = '/leagues';
export const LEAGUE_BY_ID: Function = (id) => LEAGUES + '/' + id;
export const LEAGUE_MATCHES: Function = (id) => LEAGUES + '/' + id + '/matches';
export const MATCHES: string = '/matches'
export const MATCHE_BY_ID: Function = (id) => MATCHES + '/' + id;
export const TEAMS: string = '/teams'
export const TEAM_BY_ID: Function = (id) => TEAMS + '/' + id;
export const TEAM_MATCHES: Function = (id) => TEAMS + '/' + id + '/matches';
