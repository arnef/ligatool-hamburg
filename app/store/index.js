import {
    createStore,
    applyMiddleware
} from 'redux'
import thunk from 'redux-thunk'
import Reactotron from 'reactotron-react-native'
import reducer from './reducers'
import {
    reactotronRedux
} from 'reactotron-redux'
import promise from 'redux-promise-middleware'
import apisaucePlugin from 'reactotron-apisauce'


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