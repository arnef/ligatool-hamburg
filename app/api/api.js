/* @flow */
import { create } from 'apisauce';
import baseUrl from './url';

// export const baseUrl: string = __DEV__
//   ? 'http://192.168.0.164/liga-tool'
//   // ? 'http://192.168.1.2/liga-tool'
//   // ? 'http://localhost/liga-tool'
//   // ? 'https://dev.kicker-hh.de/de/competitions'
//   : 'https://kickern-hamburg.de/de/competitions';

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
