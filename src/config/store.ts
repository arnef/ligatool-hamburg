import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import { applyMiddleware, compose, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';

import reducer from '../redux/reducer';
import sagas from '../redux/sagas';
const sagaMiddleware = createSagaMiddleware();
const middleware = [
  sagaMiddleware,
  createReactNavigationReduxMiddleware(
    'root',
    (state: any) => state.nav.navigation,
  ),
];

const config = {
  key: 'root',
  storage,
  whitelist: ['app', 'settings', 'drawer', 'user'],
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  persistReducer(config, reducer),
  composeEnhancers(applyMiddleware(...middleware)),
);
sagaMiddleware.run(sagas);

export const persistor = persistStore(store);
// persistor.purge();
