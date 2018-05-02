// Actions
export const GET_LEAGUES = 'ligatool/modules/GET_LEAGUES';
export const LEAGUES = 'ligatool/modules/LEAGUES';
export const GET_LEAGUE = 'ligatool/modules/GET_LEAGUE';
export const GET_LEAGUE_DONE = 'ligatool/modules/GET_LEAGUE_DONE';
export const GET_LEAGUE_MATCHES = 'ligatool/modules/GET_LEAGUE_MATCHES';
export const GET_LEAGUE_MATCHES_DONE =
  'ligatool/modules/GET_LEAGUE_MATCHES_DONE';
export const GET_LEAGUE_PLAYER_STATS =
  'ligatool/modules/GET_LEAGUE_PLAYER_STATS';
export const GET_LEAGUE_PLAYER_STATS_DONE =
  'ligatool/modules/GET_LEAGUE_PLAYER_STATS_DONE';

// Reducer
export default function reducer(state = {}, action) {
  switch (action.type) {
    case LEAGUES:
      state = { ...state, ...action.payload };
      break;
    case GET_LEAGUE_DONE:
      state = {
        ...state,
        [`${action.payload.id}`]: {
          ...state[`${action.payload.id}`],
          ...action.payload,
        },
      };
      break;
    case GET_LEAGUE_MATCHES_DONE:
      state = {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        },
      };
      break;
    case GET_LEAGUE_PLAYER_STATS_DONE:
      state = {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload,
        },
      };
      break;
  }
  return state;
}

// Action Creators
export function getLeagues() {
  return { type: GET_LEAGUES };
}

export function getLeague(id) {
  return { type: GET_LEAGUE, payload: { id: `${id}` } };
}

export function getMatches(id) {
  return { type: GET_LEAGUE_MATCHES, payload: { id } };
}

export function getPlayerStats(id) {
  return { type: GET_LEAGUE_PLAYER_STATS, payload: { id } };
}
