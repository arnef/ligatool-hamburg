import { createStore, applyMiddleware, compose } from 'redux';
import { autoRehydrate } from 'redux-persist';
import createMigration from 'redux-persist-migrate';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

import manifest, { APP_KEY } from '../redux/manifest';
import sagas from '../redux/sagas';
import reducer from '../redux/reducer';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

if (__DEV__) {
  middleware.push(logger);
}

const migration = createMigration(manifest, APP_KEY);

const store = createStore(
  reducer,
  compose(migration, autoRehydrate(), applyMiddleware(...middleware)),
);

sagaMiddleware.run(sagas);

export default store;
