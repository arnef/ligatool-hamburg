import { combineReducers } from 'redux';
import nav from './modules/navigation';
import settings from './modules/settings';
import auth from './modules/auth';
import myTeam from './modules/myteam';
import leagues from './modules/leagues';
import loading from './modules/loading';
import teams from './modules/teams';
import players from './modules/player';
import drawer from './modules/drawer';
import search from './modules/search';
import fixtures from './modules/fixtures';
import user from './modules/user';

export default combineReducers({
  app: (state = {}) => state,
  nav,
  settings,
  auth,
  myTeam,
  leagues,
  loading,
  teams,
  players,
  drawer,
  search,
  fixtures,
  user,
});
