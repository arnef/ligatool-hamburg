import { createStore, applyMiddleware, compose } from 'redux';
import { autoRehydrate } from 'redux-persist';
import createMigration from 'redux-persist-migrate';
import createSagaMiddleware from 'redux-saga';

import manifest, { APP_KEY } from '../redux/manifest';
import sagas from '../redux/sagas';
import reducer from '../redux/reducer';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

const migration = createMigration(manifest, APP_KEY);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  composeEnhancers(autoRehydrate(), migration, applyMiddleware(...middleware)),
);

sagaMiddleware.run(sagas);

export default store;
