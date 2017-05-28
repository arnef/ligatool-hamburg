// @flow

import type { ApiResponse as ApisauceApiResponse } from 'apisauce';

import api from './api';

export const USER_AUTH: string = '/user/auth';
export const USER_AUTH_REFRESH: string = USER_AUTH + '/refresh';
export const NOTIFICATION: string = '/notification';
export const LEAGUES: string = '/leagues';
export const MATCHES: string = '/matches';
export const TEAMS: string = '/teams';
export const PLAYER: string = '/players';

export default api;

type ApiResponse<T> = Promise<ApisauceApiResponse<T>>;

export type GetLeaguesResponse = Array<{
  id: number,
  name: string,
  shifting_rule: boolean,
  cup: boolean,
}>;

export type GetLeagueResponse = {
  id: number,
  name: string,
  shifting_rule: boolean,
  cup: boolean,
  table: Array<{
    id: number,
    name: string,
    image: ?string,
    color: ?string,
    position: ?number,
    matches: number,
    wins: ?number,
    defeats: ?number,
    draws: ?number,
    set_points_win: ?number,
    set_points_lost: ?number,
    set_points_diff: ?number,
    goals: ?number,
    goals_against: ?number,
    goals_diff: ?number,
    penalty_points: number,
    points: ?number,
  }>,
};

export type GetLeagueMatchesResponse = Array<{
  id: number,
  datetime: number,
  team_home: {
    id: number,
    name: string,
    image: ?string,
  },
  team_away: {
    id: number,
    name: string,
    image: ?string,
  },
  venue: {
    id: number,
    name: string,
    street: string,
    zip_code: number,
    city: string,
  },
  league: {
    id: number,
    name: string,
    shifting_rule: boolean,
    cup: boolean,
  },
  set_points: boolean,
  set_points_home: ?number,
  set_points_away: ?number,
  goals_home: ?number,
  goals_away: ?number,
  live: boolean,
  match_day: string,
  score_suggest: ?number,
  score_unconfirmed: number,
  date_confirmed: boolean,
}>;

export type GetLeaguePlayerRankingResponse = Array<{
  position: number,
  competitive_index: number,
  wins: number,
  draws: number,
  lost: number,
  matches: number,
  rate: string,
  player: {
    id: number,
    name: string,
    surname: string,
    image: string,
  },
}>;

export type GetMatchesResponse = Array<{
  id: number,
  datetime: number,
  team_home: {
    id: number,
    name: string,
    image: ?string,
  },
  team_away: {
    id: number,
    name: string,
    image: ?string,
  },
  venue: {
    id: number,
    name: string,
    street: string,
    zip_code: number,
    city: string,
  },
  league: {
    id: number,
    name: string,
    shifting_rule: boolean,
    cup: boolean,
  },
  set_points: boolean,
  set_points_home: ?number,
  set_points_away: ?number,
  goals_home: ?number,
  goals_away: ?number,
  live: boolean,
  match_day: string,
  score_suggest: ?number,
  score_unconfirmed: number,
  date_confirmed: boolean,
}>;

export type GetMatchResponse = {
  id: number,
  datetime: number,
  team_home: {
    id: number,
    name: string,
    image: ?string,
  },
  team_away: {
    id: number,
    name: string,
    image: ?string,
  },
  venue: {
    id: number,
    name: string,
    street: string,
    zip_code: number,
    city: string,
  },
  league: {
    id: number,
    name: string,
    shifting_rule: boolean,
    cup: boolean,
  },
  set_points: boolean,
  set_points_home: ?number,
  set_points_away: ?number,
  goals_home: ?number,
  goals_away: ?number,
  live: boolean,
  match_day: string,
  score_suggest: ?number,
  score_unconfirmed: number,
  date_confirmed: boolean,
  sets: {
    [index: string]: {
      id: number,
      player_1_home: {
        id: number,
        name: string,
        surname: string,
        number: string,
        image: string,
      },
      player_2_home: ?{
        id: number,
        name: string,
        surname: string,
        number: string,
        image: string,
      },
      player_1_away: {
        id: number,
        name: string,
        surname: string,
        number: string,
        image: string,
      },
      player_2_away: ?{
        id: number,
        name: string,
        surname: string,
        number: string,
        image: string,
      },
      goals_home: number,
      goals_away: number,
    },
  },
};

export type GetTeamResponse = {
  id: number,
  name: string,
  image: ?string,
  table: ?string,
  league: ?{
    id: number,
    name: string,
    shifting_rule: boolean,
    cup: boolean,
  },
  venue: ?{
    id: number,
    name: string,
    street: string,
    zip_code: number,
    city: string,
  },
  position: ?number,
  home_match_day: ?number,
  home_match_time: ?string,
  club: ?{
    id: number,
    name: string,
  },
  player: Array<{
    id: number,
    name: string,
    surname: string,
    number: string,
    image: string,
  }>,
};

export type GetTeamMatchesResponse = Array<{
  id: number,
  datetime: number,
  team_home: {
    id: number,
    name: string,
    image: ?string,
  },
  team_away: {
    id: number,
    name: string,
    image: ?string,
  },
  venue: {
    id: number,
    name: string,
    street: string,
    zip_code: number,
    city: string,
  },
  league: {
    id: number,
    name: string,
    shifting_rule: boolean,
    cup: boolean,
  },
  set_points: boolean,
  set_points_home: ?number,
  set_points_away: ?number,
  goals_home: ?number,
  goals_away: ?number,
  live: boolean,
  match_day: string,
  score_suggest: ?number,
  score_unconfirmed: number,
  date_confirmed: boolean,
}>;

export type GetPlayerResponse = {
  id: number,
  name: string,
  surname: string,
  number: string,
  image: string,
  classification: ?string,
  international_number: string,
  association: {
    id: number,
    name: string,
    short: string,
  },
  club: {
    id: number,
    name: string,
  },
  ranglists: Array<{
    id: number,
    name: string,
    season: string,
    position: number,
    participants: number,
  }>,
  tournament_participations: Array<{
    id: number,
    name: string,
    discipline: string,
    date: number,
    location: string,
    position: number,
    participants: number,
  }>,
  teams: Array<{
    id: number,
    name: string,
    season: string,
    competitions: Array<string>,
  }>,
  statistics: Array<{
    name: string,
    wins: number,
    draws: number,
    lost: number,
    matches: number,
    position: number,
    competitive_index: number,
    rate: string,
  }>,
};

export type AuthenticateResponse = {};

export type RefreshAuthenticationResponse = {};

export type LogoutResponse = {};

export type RegisterPushNotificationsResponse = {};

export type UpdateMatchResponse = {};

// GET /leages
export function getLeagues(): ApiResponse<GetLeaguesResponse> {
  return api.get(LEAGUES);
}

// GET /leagues/$id
export function getLeague(id: number): ApiResponse<GetLeagueResponse> {
  return api.get(LEAGUES, { id });
}

// GET /leagues/$id/matches
export function getLeagueMatches(
  id: number,
): ApiResponse<GetLeagueMatchesResponse> {
  return api.get(LEAGUES, { id, route: MATCHES });
}

// GET /leagues/$id/players
export function getLeaguePlayerRanking(
  id: number,
): ApiResponse<GetLeaguePlayerRankingResponse> {
  return api.get(LEAGUES, { id, route: PLAYER });
}

// GET /matches
export function getMatches(): ApiResponse<GetMatchesResponse> {
  return api.get(MATCHES);
}

// GET /matches/$id
export function getMatch(id: number): ApiResponse<GetMatchResponse> {
  return api.get(MATCHES, { id });
}

// GET /teams/$id
export function getTeam(id: number): ApiResponse<GetTeamResponse> {
  return api.get(TEAMS, { id });
}

// GET /teams/$id/matches
export function getTeamMatches(
  id: number,
): ApiResponse<GetTeamMatchesResponse> {
  return api.get(TEAMS, { id, route: MATCHES });
}

// GET /players/$id
export function getPlayer(id: number): ApiResponse<GetPlayerResponse> {
  return api.get(PLAYER, { id });
}

// POST /user/auth
export function authenticate(
  username: string,
  password: string,
): ApiResponse<AuthenticateResponse> {
  return api.post(USER_AUTH, { username, password });
}

// POST /user/auth/refresh
export function refreshAuthentication(
  access_key: string,
): ApiResponse<RefreshAuthenticationResponse> {
  return api.post(USER_AUTH_REFRESH, { access_key });
}

// DELETE /user/auth
export function logout(): ApiResponse<LogoutResponse> {
  return api.delete(USER_AUTH);
}

// POST /notification
export function registerPushNotifications(
  fcm_token: string,
  notification: { [key: string]: any },
): ApiResponse<RegisterPushNotificationsResponse> {
  return api.post(NOTIFICATION, { fcm_token, notification });
}

// PUT /matches/$id
export function updateMatch(
  id: number,
  body: any,
): ApiResponse<UpdateMatchResponse> {
  return api.put(`${MATCHES}/${id}`, body);
}
