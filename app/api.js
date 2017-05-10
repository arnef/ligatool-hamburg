/* @flow */
import { create } from 'apisauce';

export const baseUrl: string = __DEV__
  ? 'http://192.168.0.164/liga-tool'
  // ? 'http://192.168.1.2/liga-tool'
  // ? 'http://localhost/liga-tool'
  // ? 'https://dev.kicker-hh.de/de/competitions'
  : 'https://kickern-hamburg.de/de/competitions';

const api: API = create({
  baseURL: `${baseUrl}/index.php?option=com_sportsmanagerapi&q=`
});

if (__DEV__) {
  api.addMonitor(response => {
    console.tron.apisauce(response);
  });
}

api.addRequestTransform(request => {
  if (request.params) {
    console.tron.log(request.params);
    if (request.params.id) {
      request.url = `${request.url}/${request.params.id}`;
    }
    if (request.params.route) {
      request.url = request.params.route.indexOf('/') === -1
        ? `${request.url}/${request.params.route}`
        : `${request.url}${request.params.route}`;
    }
  }
});

export default api;

// export routes
export const USER_AUTH: string = '/user/auth';
export const USER_AUTH_REFRESH: string = USER_AUTH + '/refresh';
export const NOTIFICATION: string = '/notification';
export const LEAGUES: string = '/leagues';
export const MATCHES: string = '/matches';
export const TEAMS: string = '/teams';
