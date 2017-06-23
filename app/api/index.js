// @flow
import api from './api';
import { compareDays } from '../Helper';

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
  return new Promise(resolve => {
    api
      .post(USER_AUTH, user)
      .then(resp => {
        const apiKey = resp.data.access_key;
        refreshAuthentication(apiKey)
          .then(refreshResp => {
            resolve(
              ok({
                ...refreshResp.data,
                access_key: apiKey,
              }),
            );
          })
          .catch(error);
      })
      .catch(error);
  });
}

// POST /user/auth/refresh
export function refreshAuthentication(apiKey: string): Promise<*> {
  return new Promise(resolve => {
    api
      .post(USER_AUTH_REFRESH, { access_key: apiKey })
      .then(resp => {
        setHeader('Secret', resp.data.token);
        resolve(ok(resp.data));
      })
      .catch(ex => {
        resolve(error(ex));
      });
  });
}

// DELETE /user/auth
export function logout(): Promise<*> {
  delete api.defaults.headers.common['Secret'];
  return new Promise(resolve => {
    api.delete(USER_AUTH).then(resolve).catch(resolve);
  });
}

// GET /matches
export function getMatches() {
  return new Promise(resolve => {
    api
      .get(MATCHES)
      .then(resp => {
        const now = new Date().getTime();
        const today = [];
        const next = [];
        const played = [];

        for (let match: Match of resp.data) {
          if (match.date_confirmed) {
            const diff: number = compareDays(match.datetime, now);
            if ((match.live && diff > -2) || diff === 0) {
              today.push(`${match.id}`);
            } else if (match.set_points) {
              played.push(`${match.id}`);
            } else if (diff > 0) {
              next.push(`${match.id}`);
            }
          }
        }
        resolve(ok({ today, next, played }));
      })
      .catch(ex => {
        resolve(error(ex));
      });
  });
}

// GET /matches/{matchid}
export function getMatch(id: number): Promise<*> {
  return new Promise(resolve => {
    api
      .get(`${MATCHES}/${id}`)
      .then(resp => {
        resolve(ok(resp.data));
      })
      .catch(ex => {
        resolve(error(ex));
      });
  });
}

// GET /teams/{teamid}
export function getTeam(id: number): Promise<*> {
  return new Promise((resolve: Function) => {
    api
      .get(`${TEAMS}/${id}`)
      .then(resp => {
        resolve(ok(resp.data));
      })
      .catch(ex => {
        resolve(error(ex));
      });
  });
}

// GET /teams/{myteamid}/matches
export function getMyTeamMatches(id: number): Promise<*> {
  return new Promise((resolve: Function) => {
    api
      .get(`${MATCHES}/${id}`)
      .then(resp => {
        const played = [];
        const next = [];
        for (let match: Match of resp.data) {
          if (match.set_points && !match.score_unconfirmed) {
            played.push(`${match.id}`);
          } else {
            next.push(`${match.id}`);
          }
        }
        resolve(ok({ played, next }));
      })
      .catch(ex => {
        resolve(error(ex));
      });
  });
}

function ok(data) {
  return { ok: true, data };
}

function error(ex: { message: string }) {
  return { ok: false, error: ex.message };
}
