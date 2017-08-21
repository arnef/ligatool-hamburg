// @flow
import { combineReducers } from 'redux';
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
import search from './modules/search';

export default combineReducers({
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
  search,
});
