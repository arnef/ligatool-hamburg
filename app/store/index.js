import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import Reactotron from 'reactotron-react-native'
import reducer from './reducers'
import { reactotronRedux } from 'reactotron-redux'
import promise from 'redux-promise-middleware'
import apisaucePlugin from 'reactotron-apisauce'

const middleware = [ promise(), thunk ]

if (__DEV__) {

    Reactotron.configure({
        // host: '192.168.1.9',
        // host: '192.168.0.164',
        name: 'LigaTool'
    })
    .use(reactotronRedux())
    .use(apisaucePlugin())
    .connect()

    console.tron = Reactotron
} else {
    // a mock version should you decide to leave console.tron in your codebase
    console.tron = {
        display: () => false,
        error: () => false,
        image: () => false,
        log: () => false,
        warn: () => false
    }
}

// use reactron createsore in dev mode
const cs = __DEV__ ? console.tron.createStore : createStore
const store = cs(reducer, applyMiddleware(...middleware))

export default store
