import { combineReducers } from 'redux';

import auth from './modules/auth';
import drawer from './modules/drawer';
import fixtures from './modules/fixtures';
import leagues from './modules/leagues';
import loading from './modules/loading';
import myTeam from './modules/myteam';
import nav from './modules/navigation';
import players from './modules/player';
import search from './modules/search';
import settings from './modules/settings';
import teams from './modules/teams';
import user from './modules/user';

export default combineReducers({
  auth,
  drawer,
  fixtures,
  leagues,
  loading,
  myTeam,
  nav,
  players,
  search,
  settings,
  teams,
  user,
});
