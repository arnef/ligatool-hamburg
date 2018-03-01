// @flow
// Type Definitions
type State = {
  +[string]: League,
};

type GetLeaguesAction = {
  type: GET_LEAGUES,
};
type GetLeagueAction = {
  type: GET_LEAGUE,
  payload: { id: string },
};
type LeaguesAction = {
  type: LEAGUES,
  payload: { [string]: League },
};

type Action = GetLeaguesAction | LeaguesAction;

// Actions
export const GET_LEAGUES: GET_LEAGUES = 'ligatool/modules/GET_LEAGUES';
export const LEAGUES: LEAGUES = 'ligatool/modules/LEAGUES';
export const GET_LEAGUE: GET_LEAGUE = 'ligatool/modules/GET_LEAGUE';
export const GET_LEAGUE_FIX = 'ligatool/modules/GET_LEAGUE_FIX';
export const GET_LEAGUE_DONE: GET_LEAGUE_DONE =
  'ligatool/modules/GET_LEAGUE_DONE';
export const GET_LEAGUE_MATCHES: GET_LEAGUE_MATCHES =
  'ligatool/modules/GET_LEAGUE_MATCHES';
export const GET_LEAGUE_MATCHES_DONE: GET_LEAGUE_MATCHES_DONE =
  'ligatool/modules/GET_LEAGUE_MATCHES_DONE';
export const GET_LEAGUE_PLAYER_STATS: GET_LEAGUE_PLAYER_STATS =
  'ligatool/modules/GET_LEAGUE_PLAYER_STATS';
export const GET_LEAGUE_PLAYER_STATS_DONE: GET_LEAGUE_PLAYER_STATS_DONE =
  'ligatool/modules/GET_LEAGUE_PLAYER_STATS_DONE';

// Reducer
export default function reducer(state: State = {}, action: Action): State {
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
export function getLeagues(): GetLeaguesAction {
  return { type: GET_LEAGUES };
}

export function getLeague(id: number | string): GetLeagueAction {
  return { type: GET_LEAGUE, payload: { id: `${id}` } };
}

export function getLeagueFix(id) {
  return {
    type: GET_LEAGUE_FIX,
    payload: { id: `${id}` },
  };
}

export function getMatches(id: number | string): Action {
  return { type: GET_LEAGUE_MATCHES, payload: { id } };
}

export function getPlayerStats(id: number | string): Action {
  return { type: GET_LEAGUE_PLAYER_STATS, payload: { id } };
}
