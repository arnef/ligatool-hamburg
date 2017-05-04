// @flow
import { QUERY_MATCHES, GET_MATCH, SET_PLAYER, PUT_SETS, TOGGLE_D5, PENDING, FULFILLED } from './types';
import api, { MATCHES, MATCHE_BY_ID} from '../../api';


export function queryMatches (): Action {
  return {
      payload: api.get(MATCHES),
      type: QUERY_MATCHES
  };
}

export function getMatch (id: number): Action {
    return {
        payload: {
            data: id,
            promise: api.get(MATCHE_BY_ID(id))
        },
        type: GET_MATCH
    };
}

export function setPlayer (id: number, team: Team, player: Player, setsIdx: Array<number>): Action {
    return {
        payload: { id, player, setsIdx, team },
        type: SET_PLAYER
    };
}

export function updateSets (matchId: number, sets: any): Action  {
  console.tron.log(sets);
  return {
      payload: api.put(MATCHE_BY_ID(matchId), { sets } ),
      type: PUT_SETS
  };
};

export const suggestScore = (matchId: number, sets: any, type: number) => {
    if (type === 1) {
        throw 'Wrong type for suggestScore action, must be 0 or 2'
    }
    const action = type === 0 ? { score_suggest: true } : { score_unconfirmed: false }
    const body = { sets, ...action }

    return {
        payload: api.put(MATCHE_BY_ID(matchId), body),
        type: PUT_SETS
    };
}

export const toggleMatchType = (id: number, setsIdx: Array<number>, type: string) => {
    return {
        payload: { id, idx: setsIdx, type },
        type: TOGGLE_D5
    };
}
