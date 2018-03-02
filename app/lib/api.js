import axios from 'axios';
import { URL, ASSOC } from '../config/settings';
import json_ from 'json_';
import _ from 'lodash';

const instance = axios.create({
  baseURL: `${URL}/v1/`,
  transformResponse: [
    (data, headers) => {
      if (
        headers['content-type'] &&
        headers['content-type'].indexOf('application/json') !== -1
      ) {
        data = json_.parse(data);
      }
      return data;
    },
  ],
});

instance.interceptors.response.use(response => response.data);

export function setFCM(fcm) {
  instance.defaults.headers.common['x-fcm'] = fcm;
}

export function setAuthorization(value) {
  instance.defaults.headers.authorization = `Bearer ${value}`;
}

export function setSecret(value) {
  instance.defaults.headers.common.Secret = value;
}

// POST /user/auth
export function authenticate(user) {
  return instance.post(`/user/auth?assoc=${ASSOC}`, user);
}

// POST /user/auth/refresh
export function refreshAuthentication(access_key) {
  return new Promise((resolve, reject) => {
    instance
      .post(`/user/auth/refresh?assoc=${ASSOC}`, { access_key })
      .then(resp => {
        setSecret(resp.data.token);
        resolve(resp);
      })
      .catch(reject);
  });
}

// DELETE /user/auth
export function logout() {
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

// GET /fixtures?assoc=:config.assoc
export function getMatches() {
  return instance.get(`/fixtures?assoc=${ASSOC}`);
}

// GET /fixtures/{id}
export function getMatch(id) {
  return instance.get(`/fixtures/${id}`);
}

// // PATCH /fixtures/{id}/games
// export function updateMatch(id, data) {
//   return instance.patch(`/fixtures/${id}/games`, data);
// }

// PATCH /fixtures/:id/games?vid=:fixture.competitionId
export function patchFixtureGames(fixture, payload) {
  return instance.patch(
    `/fixtures/${fixture.id}/games?vid=${fixture.competitionId}`,
    payload,
  );
}

// PUT /fixrures/:fixture.id/games?vid=:fixture.competitionId
export function putFixtureGames(fixture, games) {
  return new Promise((resolve, reject) => {
    instance
      .put(`/fixtures/${fixture.id}/games?vid=${fixture.competitionId}`, games)
      .then(resp => {
        resp.meta.games = _.keyBy(resp.meta.games, 'gameNumbers');
        resolve(resp);
      })
      .catch(reject);
  });
}

// POST /fixtures/:fixture.id/games?vid=:fixture.competitionId
export function postFixtureGames(fixture) {
  return new Promise((resolve, reject) => {
    instance
      .post(`/fixtures/${fixture.id}/games?vid=${fixture.competitionId}`)
      .then(resp => {
        // resp.meta.games = _.keyBy(resp.meta.games, 'gameNumbers');
        resolve(resp);
      })
      .catch(reject);
  });
}

// GET /fixtures/:id/dates?vid:=fixture.competitionId
export function getFixtureDates(fixture) {
  return instance.get(
    `/fixtures/${fixture.id}/dates?vid=${fixture.competitionId}`,
  );
}

// PUT /fixtures/:id/dates?vid=:fixture.comeptitionId
export function putFixtureDates(fixture, dates, minDates, maxDates) {
  return instance.put(
    `/fixtures/${fixture.id}/dates?vid=${fixture.competitionId}`,
    {
      dates,
      min_dates: minDates,
      max_dates: maxDates,
    },
  );
}

// PATCH /fixtures/:fixture.id/date?vid=:fixture.competitionId
export function patchFixtureDate(fixture, datetimeId) {
  return instance.patch(
    `/fixtures/${fixture.id}/date?vid=${fixture.competitionId}`,
    {
      datetime: { id: datetimeId },
    },
  );
}

// GET /teams/{id}
export function getTeam(id) {
  return instance.get(`/teams/${id}`);
}

// GET /teams/{id}/matches
export function getTeamMatches(id) {
  return instance.get(`/teams/${id}/fixtures`);
}

// GET /leagues
export function getLeagues() {
  return instance.get(`/competitions?assoc=${ASSOC}`);
}

// GET /leagues/{id}
export function getLeague(id) {
  return instance.get(`/competitions/${id}`);
}

// GET /leagues/{id}/matches
export function getLeagueMatches(id) {
  return instance.get(`/competitions/${id}`);
}

// GET /leagues/{id}/players
export function getLeaguePlayers(id) {
  return instance.get(`/competitions/${id}/stats`);
}

// GET /players/{id}
export function getPlayer(id) {
  return instance.get(`/players/${id}`);
}

/* Route Notifications */
// PUT /notidications
export function putNotification(
  token,
  enabled,
  sound,
  interimResults,
  finalResults,
) {
  return instance.put(`/notifications?assoc=${ASSOC}`, {
    token,
    enabled,
    sound,
    interim_results: interimResults,
    final_results: finalResults,
  });
}

// POST /notifications/fixture/:fixtureId
export function postNotificationFixture(fixtureId) {
  return instance.post(`/notifications/fixture/${fixtureId}`);
}

// DELETE /notifications/fixture/:fixtureId
export function deleteNotificationFixture(fixtureId) {
  return instance.delete(`/notifications/fixture/${fixtureId}`);
}

// POST /notification
// export function updateNotifications(
//   fcm_token: string,
//   notification: any,
// ): Promise<*> {
//   return instance.post('/notification', { fcm_token, notification });
// }

// GET /search
// export function search(query: string) {
//   return instance.get('/search/' + encodeURI(query));
// }
