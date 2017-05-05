import { combineReducers } from 'redux';

import settings from './settingsReducer';
import auth from './authReducer';
import leagues from './leaguesReducer';
import dialog from './dialogReducer';
import matches from './matchesReducer';
import teams from './teamsReducer';
import loading from './loadingReducer';
import nav from './navReducer';

import overview from './overviewReducer';
import myTeam from './myTeamReducer';

export default combineReducers({
  app: (state = {}, action) => state,
  auth,
  dialog,
  leagues,
  loading,
  matches,
  nav,
  settings,
  teams,
  overview,
  myTeam
});
