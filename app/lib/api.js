// @flow
import axios from 'axios';
import { URL } from '../config/settings';

const instance = axios.create({
  baseURL: `${URL}/index.php?option=com_sportsmanagerapi&q=`,
});

instance.interceptors.request.use(
  config => {
    if (config.method === 'get') {
      config.url += `&timestamp=${new Date().getTime()}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export function setHeader(name: string, value: string) {
  console.warn('using set header is depricated');
  instance.defaults.headers.common[name] = value;
}

export function setSecret(value: string) {
  instance.defaults.headers.common.Secret = value;
}

// POST /user/auth
export function authenticate(user: {
  username: string,
  password: string,
}): Promise<*> {
  return instance.post('/user/auth', user);
}

// POST /user/auth/refresh
export function refreshAuthentication(access_key: string): Promise<*> {
  return new Promise((resolve, reject) => {
    instance
      .post('/user/auth/refresh', { access_key })
      .then(resp => {
        setSecret(resp.data.token);
        resolve(resp);
      })
      .catch(reject);
  });
}

// DELETE /user/auth
export function logout(): Promise<*> {
  return new Promise((resolve, reject) => {
    instance
      .delete('/user/auth')
      .then(resp => {
        delete instance.defaults.headers.common.Secret;
        resolve(resp);
      })
      .catch(ex => {
        delete instance.defaults.headers.common.Secret;
        reject(ex);
      });
  });
}

// GET /matches
export function getMatches(): Promise<*> {
  return instance.get('/matches');
}

// GET /matches/{id}
export function getMatch(id: number): Promise<*> {
  return instance.get(`/matches/${id}`);
}

// PUT /matches/{id}
export function updateMatch(id: number, data: any): Promise<*> {
  return instance.put(`/matches/${id}`, data);
}

// GET /teams/{id}
export function getTeam(id: number): Promise<*> {
  return instance.get(`/teams/${id}`);
}

// GET /teams/{id}/matches
export function getTeamMatches(id: number): Promise<*> {
  return instance.get(`/teams/${id}/matches`);
}

// GET /leagues
export function getLeagues(): Promise<*> {
  return instance.get('/leagues');
}

// GET /leagues/{id}
export function getLeague(id: number): Promise<*> {
  return instance.get(`/leagues/${id}`);
}

// GET /leagues/{id}/matches
export function getLeagueMatches(id: number): Promise<*> {
  return instance.get(`/leagues/${id}/matches`);
}

// GET /leagues/{id}/players
export function getLeaguePlayers(id: number): Promise<*> {
  return instance.get(`/leagues/${id}/players`);
}

// GET /players/{id}
export function getPlayer(id: number): Promise<*> {
  return instance.get(`/players/${id}`);
}

// POST /notification
export function updateNotifications(
  fcm_token: string,
  notification: any,
): Promise<*> {
  return instance.post('/notification', { fcm_token, notification });
}
