/* @flow */
import { create } from 'apisauce';
import config from '../config';

const api = create({
  baseURL: `${config.baseUrl}/index.php?option=com_sportsmanagerapi&q=`,
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
  if (request.method === 'get') {
    request.url += `&timestamp=${new Date().getTime()}`;
  }
});

export default api;
