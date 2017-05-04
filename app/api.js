/* @flow */
import { create } from 'apisauce'

export const baseUrl: string = __DEV__ ?
    'http://192.168.0.164/liga-tool' :
    // 'http://192.168.1.14/liga-tool' :
    // 'http://localhost/liga-tool' :
    // 'https://dev.kicker-hh.de/de/competitions' :
    'https://kickern-hamburg.de/de/competitions'


const api: API = create({
    baseURL: `${baseUrl}/index.php?option=com_sportsmanagerapi&q=`
});

if (__DEV__) {
    api.addMonitor(response => {
        console.tron.apisauce(response)
    })
}

export default api;

// export routes
export const USER_AUTH: string = '/user/auth';
export const USER_AUTH_REFRESH: string = USER_AUTH + '/refresh';
export const NOTIFICATION: string = '/notification';
export const LEAGUES: string = '/leagues';
export const LEAGUE_BY_ID: (id: number) => string = (id: number) => LEAGUES + '/' + id;
export const LEAGUE_MATCHES: (id: number) => string = (id: number) => LEAGUES + '/' + id + '/matches';
export const MATCHES: string = '/matches'
export const MATCHE_BY_ID: (id: number) => string = (id: number) => MATCHES + '/' + id;
export const TEAMS: string = '/teams'
export const TEAM_BY_ID: (id: number) => string = (id: number) => TEAMS + '/' + id;
export const TEAM_MATCHES: (id: number) => string = (id: number) => TEAMS + '/' + id + '/matches';
