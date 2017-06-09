import { createStore, applyMiddleware, compose } from 'redux';
import { autoRehydrate } from 'redux-persist';
import createMigration from 'redux-persist-migrate';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import manifest, { APP_KEY } from './manifest';
import reducer from './reducers';
import promise from 'redux-promise-middleware';

const middleware = [promise(), thunk];

if (__DEV__) {
  middleware.push(logger);
}

const migration = createMigration(manifest, APP_KEY);
const store = createStore(
  reducer,
  compose(migration, autoRehydrate(), applyMiddleware(...middleware)),
);

export default store;
