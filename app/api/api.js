/* @flow */
import baseUrl from './url';
import axios from 'axios';

const api = axios.create({
  baseURL: `${baseUrl}/index.php?option=com_sportsmanagerapi&q=`,
});

if (__DEV__) {
  // api.addMonitor(response => {
  //   console.log(response);
  // });
}

// api.addRequestTransform(request => {
//   if (request.params) {
//     if (request.params.id) {
//       request.url = `${request.url}/${request.params.id}`;
//     }
//     if (request.params.route) {
//       request.url = request.params.route.indexOf('/') === -1
//         ? `${request.url}/${request.params.route}`
//         : `${request.url}${request.params.route}`;
//     }
//   }
//   if (request.method === 'get') {
//     request.url += `&timestamp=${new Date().getTime()}`;
//   }
// });

export default api;
// export default {
//   get: (url, params) => { console.log(url, params) },
//   post: (url, params) => { console.log(url, params) },
//   setHeader: (key, value) => { console.log(key, value) }
// }
