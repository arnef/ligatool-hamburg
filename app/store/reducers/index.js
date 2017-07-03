import { combineReducers } from 'redux';
import settings from './settingsReducer';
import auth from './authReducer';
import leagues from './leaguesReducer';
// import matches from './matchesReducer';
import matches from '../modules/match';
import teams from './teamsReducer';
import loading from './loadingReducer';
import nav from './navReducer';
// import overview from './overviewReducer';
import overview from '../modules/overview';
import myTeam from './myTeamReducer';
import players from './playersReducer';

export default combineReducers({
  app: (state = {}) => state,
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
