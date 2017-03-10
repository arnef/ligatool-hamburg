import { QUERY_RANKINGS, GET_LEAGUE, GET_LEAGUE_MATCHES } from './types';
import api from '../../api';

export const getRankings = () => {
	return {
		type: QUERY_RANKINGS,
		payload: api.get('/leagues')
	};
};


export const getLeague = (id) => {
	return {
		type: GET_LEAGUE,
		payload: api.get('/leagues/' + id)
	};
};


export const getLeagueMatches = (id) => {
	return {
		type: GET_LEAGUE_MATCHES,
		payload: {
			data: id,
			promise: api.get(`/leagues/${id}/matches`)
		}
	};
};

