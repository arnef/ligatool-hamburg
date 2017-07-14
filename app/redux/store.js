import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { autoRehydrate } from 'redux-persist';
import createMigration from 'redux-persist-migrate';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import manifest, { APP_KEY } from '../store/manifest';
// import reducers
import sagas from './sagas';
import nav from './modules/navigation';
import settings from './modules/settings';
import auth from './modules/auth';
import overview from './modules/overview';
import matches from './modules/matches';
import myTeam from './modules/myteam';
import leagues from './modules/leagues';
import loading from './modules/loading';
import teams from './modules/teams';
import players from './modules/player';
import drawer from './modules/drawer';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

if (__DEV__) {
  middleware.push(logger);
}

const reducer = combineReducers({
  app: (state = {}) => state,
  nav,
  settings,
  auth,
  overview,
  matches,
  myTeam,
  leagues,
  loading,
  teams,
  players,
  drawer,
});

const migration = createMigration(manifest, APP_KEY);

const store = createStore(
  reducer,
  compose(migration, autoRehydrate(), applyMiddleware(...middleware)),
);

sagaMiddleware.run(sagas);

export default store;
