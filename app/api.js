import { create } from 'apisauce';

export const baseUrl = __DEV__ ? 
    // 'https://dev.kickern-hh.de/de/competitions' :
    'http://localhost/liga-tool' :
    'https://kickern-hamburg.de/de/competitions';


const api = create({
    baseURL: `${baseUrl}/index.php?option=com_sportsmanagerapi&q=`,
    timeout: 5000
});

if (__DEV__) {
    api.addMonitor(response => {
        console.tron.apisauce(response);
    });
}

export default api;
