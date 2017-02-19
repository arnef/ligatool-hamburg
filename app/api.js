import { create } from 'apisauce';
export const baseUrl = 'https://kickern-hamburg.de/de/competitions';

const api = create({
    // baseURL: `${baseUrl}/api`
    baseURL: 'http://localhost/liga-tool/index.php?option=com_sportsmanagerapi&q='
    // baseURL: 'http://192.168.0.199/liga-tool/index.php?option=com_smapi&q='
    // baseURL: 'http://192.168.0.184/liga-tool/api'
});

api.addMonitor(response => {
    console.tron.apisauce(response);
});

export default api;
