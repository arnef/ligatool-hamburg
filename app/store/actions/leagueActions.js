import { QUERY_RANKINGS, GET_LEAGUE } from './types';
import api from '../../api';

export function getRankings() {
	return {
		type: QUERY_RANKINGS,
		payload: api.get('/leagues')
	};
}

export const getLeague = (id) => {
	return {
		type: GET_LEAGUE,
		payload: api.get('/leagues/' + id)
	};
}