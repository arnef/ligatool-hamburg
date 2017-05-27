import { combineReducers } from 'redux';
import settings from './settingsReducer';
import auth from './authReducer';
import leagues from './leaguesReducer';
import matches from './matchesReducer';
import teams from './teamsReducer';
import loading from './loadingReducer';
import nav from './navReducer';
import overview from './overviewReducer';
import myTeam from './myTeamReducer';
import players from './playersReducer';

export default combineReducers({
  app: (state = {}, action) => state,
  auth,
  nav,
  leagues,
  loading,
  matches,
  settings,
  teams,
  overview,
  myTeam,
  players,
});
