// @flow
import {
  FULFILLED,
  QUERY_RANKINGS,
  GET_LEAGUE,
  QUERY_LEAGUE_MATCHES,
  GET_PLAYERS_STATS
} from '../actions/types';

const initialState: LeaguesState = {};

export default function(
  state: LeaguesState = initialState,
  action: Action
): LeaguesState {
  switch (action.type) {
    case QUERY_RANKINGS + FULFILLED:
      if (action.payload.ok) {
        state = { ...state };
        for (let league of action.payload.data) {
          state[league.id] = league;
        }
      }
      return state;

    case GET_LEAGUE + FULFILLED:
      if (action.payload.ok) {
        let league = state[action.payload.data.id];
        if (league) {
          league = { ...league, ...action.payload.data };
        } else {
          league = action.payload.data;
        }
        state = { ...state, [action.payload.data.id]: league };
      }
      return state;

    case QUERY_LEAGUE_MATCHES + FULFILLED:
      if (action.payload.ok && state[action.payload.config.params.id]) {
        state = { ...state };
        const matchDays = getMatchDays(action.payload.data);
        state[action.payload.config.params.id].match_days = matchDays.matchdays;
        state[action.payload.config.params.id].selected = matchDays.selected;
      }
      return state;

    case GET_PLAYERS_STATS + FULFILLED:
      if (action.payload.ok) {
        state = { ...state };
        state[action.payload.config.params.id].players = action.payload.data;
      }
      return state;

    default:
      return state;
  }
}

type MatchDays = {
  matchdays: { [matchday: string]: Array<number> },
  selected: ?string
};

function getMatchDays(matches: Array<Match>): MatchDays {
  const matchDays: MatchDays = {
    matchdays: {},
    selected: null
  };

  for (let match: Match of matches) {
    if (!matchDays.matchdays[match.match_day]) {
      matchDays.matchdays[match.match_day] = [];
    }
    matchDays.matchdays[match.match_day].push(match.id);
    if (!match.set_points && !matchDays.selected) {
      matchDays.selected = match.match_day;
    }
  }
  if (!matchDays.selected) {
    matchDays.selected = matches[matches.length-1].match_day;
  }

  return matchDays;
}
