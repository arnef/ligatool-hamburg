import { QUERY_MATCHES, GET_MATCH, SET_PLAYER, PUT_SETS, 
         TOGGLE_D5 
} from './types';
import api from '../api';


export const queryMatches = () => {
	return {
		type: QUERY_MATCHES,
        payload: api.get('/matches')
	};
};

export const getMatch = (id) => {
	return {
		type: GET_MATCH,
		payload: {
            promise: api.get('/matches/' + id),
            data: id
        }
	};
};

export const setPlayer = (team, player, setsIdx) => {
	return {
		type: SET_PLAYER,
		payload: { team, player, setsIdx }
	};
};

export const updateSets = (matchId, sets) =>  {
    return {
        type: PUT_SETS,
        payload: api.put('/matches/'+matchId, { sets} )
    };
};

export const suggestScore = (matchId, sets, type) => {
	if (type === 1) {
		throw 'Wrong type for suggestScore action, must be 0 or 2';
	}
	const action = type === 0 ? { score_suggest: true } : { score_unconfirmed: false };
	const body = { sets, ...action };
	return {
		type: PUT_SETS,
		payload: api.put('/matches/'+ matchId, body)
	};
};

export const toggleMatchType = (setsIdx) => {
	return {
		type: TOGGLE_D5,
		payload: setsIdx
	};
};