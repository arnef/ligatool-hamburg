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
            host: '192.168.0.163',
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