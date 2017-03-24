import { combineReducers } from 'redux'

import settings from './settingsReducer'
import auth from './authReducer'
import leagues from './leaguesReducer'
import match from './matchReducer'
import dialog from './dialogReducer'
import teamMatches from './teamMatchesReducer'
import matches from './matchesReducer'
import teams from './teamReducer'
import league from './leagueReducer'
import loading from './loadingReducer'
import appConnected from './restoreReducer'
import route from './routeReducer'
// import nav from './navReducer'

export default combineReducers({
	appConnected,
	settings,
	matches,
	auth,
	teamMatches,
	leagues,
	league,
	match,
	dialog,
	teams,
	loading,
	route
})
