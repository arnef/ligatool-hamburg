/* @flow */
import baseUrl from './url';
import axios from 'axios';

const api = axios.create({
  baseURL: `${baseUrl}/index.php?option=com_sportsmanagerapi&q=`,
});

api.interceptors.request.use(
  function(config) {
    if (config.method === 'get') {
      config.url = `${config.url}&timestamp=${new Date().getTime()}`;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  },
);

export default api;
