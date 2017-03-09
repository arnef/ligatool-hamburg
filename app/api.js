import { create } from 'apisauce';

export const baseUrl = __DEV__ ? 
    // 'https://dev.kickern-hh.de/de/competitions' :
    'http://192.168.1.4/liga-tool' :
    'https://kickern-hamburg.de/de/competitions';


const api = create({
    baseURL: `${baseUrl}/index.php?option=com_sportsmanagerapi&q=`
});

if (__DEV__) {
    api.addMonitor(response => {
        console.tron.apisauce(response);
    });
}

export default api;
