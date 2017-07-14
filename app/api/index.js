// @flow
import api from './api';

export const USER_AUTH: string = '/user/auth';
export const USER_AUTH_REFRESH: string = USER_AUTH + '/refresh';
export const NOTIFICATION: string = '/notification';
export const LEAGUES: string = '/leagues';
export const MATCHES: string = '/matches';
export const TEAMS: string = '/teams';
export const PLAYER: string = '/players';

export default api;

export function setHeader(name: string, value: string) {
  api.defaults.headers.common[name] = value;
}

// POST /user/auth
export function authenticate(user: {
  username: string,
  password: string,
}): Promise<*> {
  return api.post(USER_AUTH, user);
}

// POST /user/auth/refresh
export function refreshAuthentication(apiKey: string): Promise<*> {
  return new Promise((resolve, reject) => {
    api
      .post(USER_AUTH_REFRESH, { access_key: apiKey })
      .then(resp => {
        setHeader('Secret', resp.data.token);
        resolve(resp);
      })
      .catch(ex => {
        reject(ex);
      });
  });
}

// DELETE /user/auth
export function logout(): Promise<*> {
  delete api.defaults.headers.common['Secret'];
  return api.delete(USER_AUTH);
}

// GET /matches
export function getMatches() {
  return api.get(MATCHES);
}

// GET /matches/{matchid}
export function getMatch(id: number): Promise<*> {
  return api.get(`${MATCHES}/${id}`);
}

export function updateMatch(id: number | string, data: any) {
  return api.put(`${MATCHES}/${id}`, data);
}

// GET /teams/{teamid}
export function getTeam(id: number): Promise<*> {
  return api.get(`${TEAMS}/${id}`);
}

// GET /teams/{myteamid}/matches
export function getTeamMatches(id: number): Promise<*> {
  return api.get(`${TEAMS}/${id}${MATCHES}`);
}

// GET /leagues
export function getLeagues(): Promise<*> {
  return api.get(LEAGUES);
}

// GET /leagues/{id}
export function getLeague(id: number | string): Promise<*> {
  return api.get(`${LEAGUES}/${id}`);
}

// GET /leagues/{id}/matches
export function getLeagueMatches(id: number | string): Promise<*> {
  return api.get(`${LEAGUES}/${id}${MATCHES}`);
}

// GET /leagues/{id}/players
export function getLeaguePlayers(id: number | string): Promise<*> {
  return api.get(`${LEAGUES}/${id}${PLAYER}`);
}

export function getPlayer(id: number | string): Promise<*> {
  return api.get(`${PLAYER}/${id}`);
}

// POST /notification
export function updateNotifications(
  fcmToken: string,
  notification: any,
): Promise<*> {
  return api.post(NOTIFICATION, { fcm_token: fcmToken, notification });
}
