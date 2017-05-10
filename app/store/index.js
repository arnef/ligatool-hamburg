import { AsyncStorage, Platform } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import createMigration from 'redux-persist-migrate';
import thunk from 'redux-thunk';
import Reactotron from 'reactotron-react-native';
import manifest, { APP_KEY } from './manifest';
import reducer from './reducers';
import { reactotronRedux } from 'reactotron-redux';
import promise from 'redux-promise-middleware';
import apisaucePlugin from 'reactotron-apisauce';

const middleware = [promise(), thunk];

if (__DEV__) {
  Reactotron.configure({
    host: '192.168.0.164',
    name: 'LigaTool'
  })
    .use(reactotronRedux())
    .use(apisaucePlugin())
    .connect();

  console.tron = {
    clear: Reactotron.clear,
    log: (data) => {
      Reactotron.log({
        platform: Platform.OS,
        message: data
      });
    },
    error: Reactotron.error,
    display: Reactotron.display,
    warn: Reactotron.warn,
    createStore: Reactotron.createStore
  };
  console.tron.clear();

} else {
  // a mock version should you decide to leave console.tron in your codebase
  console.tron = {
    display: () => false,
    error: () => false,
    image: () => false,
    log: () => false,
    warn: () => false
  };
}

// use reactron createsore in dev mode
const cs = __DEV__ ? console.tron.createStore : createStore;
const migration = createMigration(manifest, APP_KEY);
const store = cs(
  reducer,
  compose(
    migration,
    autoRehydrate(),
    applyMiddleware(...middleware)
  )
);

export default store;
