import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import createSagaMiddleware from 'redux-saga';

import sagas from '../redux/sagas';
import reducer from '../redux/reducer';
const sagaMiddleware = createSagaMiddleware();
const middleware = [
  sagaMiddleware,
  createReactNavigationReduxMiddleware('root', state => state.nav.navigation),
];

const config = {
  key: 'root',
  storage,
  whitelist: ['app', 'settings', 'drawer', 'user'],
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


export const store = createStore(
  persistReducer(config, reducer),
  composeEnhancers(
    applyMiddleware(...middleware)),
);
sagaMiddleware.run(sagas);

export const persistor = persistStore(store);
// persistor.purge();