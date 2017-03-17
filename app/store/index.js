import {
    createStore,
    applyMiddleware
} from 'redux';
import thunk from 'redux-thunk';
import Reactotron from 'reactotron-react-native';
import reducer from './reducers';
import {
    reactotronRedux
} from 'reactotron-redux';
import promise from 'redux-promise-middleware';
import apisaucePlugin from 'reactotron-apisauce';
import {
    INIT_APP,
    LOAD_ACCESS_KEY,
    LOAD_TOKEN,
    TOKEN,
    API_KEY,
    SETTINGS_KEY,
    LOAD_SETTINGS,
    PUT_NOTIFICATION,
    FULFILLED
} from './actions/types';
import api from '../api';
import Storage from '../Storage';


const middleware = [
    promise(),
    thunk
];


if (__DEV__) {
    // quick fix for logging promise state actions in reactotron
    const logger = store => next => action => {
        return next(action);
    };
    middleware.push(logger);


    Reactotron.configure({
            // host: '192.168.1.4',
            // host: '192.168.0.163',
            name: 'LigaTool'
        })
        .use(reactotronRedux())
        .use(apisaucePlugin())
        .connect();

    console.tron = Reactotron;
    console.tron.clear();
} else {
    // a mock version should you decide to leave console.tron in your codebase
    console.tron = {
        log: () => false,
        warn: () => false,
        error: () => false,
        display: () => false,
        image: () => false
    }
}

// use reactron createsore in dev mode
const cs = __DEV__ ? console.tron.createStore : createStore;

export default cs(reducer, applyMiddleware(...middleware));

// restore settings and token
// if (!store.getState().restored) {
//     const authTask = new Promise(resolve => {
//         Promise.all([Storage.getItem(API_KEY), Storage.getItem(TOKEN)])
//             .then(values => {
//                 const apiKey = values[0];
//                 const apiToken = values[1];
//                 if (apiKey.ok && apiToken.ok) {
//                     store.dispatch({
//                         type: LOAD_ACCESS_KEY + FULFILLED,
//                         payload: apiKey
//                     });
//                     if (apiToken.data.expires < (new Date()).getMilliseconds()) {
//                         api.post('/user/auth/refresh', {
//                             access_key: apiKey.data
//                         }).then(data => {
//                             store.dispatch({
//                                 type: TOKEN + FULFILLED,
//                                 payload: data
//                             });
//                             resolve();
//                         });
//                     } else {
//                         const settings = store.getState().settings;
//                         store.dispatch({
//                             type: LOAD_TOKEN + FULFILLED,
//                             payload: api.put('/notification', {
//                                 notification: settings.notification,
//                                 fcm_token: settings.fcm_token
//                             })
//                         });
//                         resolve();
//                     }
//                 } else {
//                     resolve();
//                 }

//             });
//     });

//     const settingsTask = new Promise(resolve => {
//         Storage.getItem(SETTINGS_KEY).then(settings => {
//             if (!settings.ok) {
//                 api.get('/leagues').then(resp => {
//                     let notification  = {};
//                     if (resp.ok) {
//                         console.tron.log(resp);
//                         notification = {
//                             on: true,
//                             live: true,
//                             ended: true,
//                             leagues: {}
//                         };
//                         for (let league of resp.data) {
//                             notification.leagues[`${league.id}`] = true;
//                         }
//                     }
//                     Storage.setItem(SETTINGS_KEY, { notification });
//                     resolve({
//                         ok: true,
//                         data: {
//                             notification
//                         }
//                     });
//                 });
//             } else {
//                 resolve(settings);
//             }
//         });
//     });

//     Promise.all([authTask, settingsTask]).then(values => {
//         const settings = values[1];
//         store.dispatch({
//             type: LOAD_SETTINGS + FULFILLED,
//             payload: settings
//         });
//         store.dispatch({
//             type: INIT_APP,
//             payload: {
//                 done: true
//             }
//         });
//     });
// }

// export default store;