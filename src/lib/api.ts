import axios from 'axios';
import json_ from 'json_';
import _ from 'lodash';

import { ASSOC, URL } from '../config/settings';

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

export function setFCM(fcm: string) {
  instance.defaults.headers.common['x-fcm'] = fcm;
}

export function setAuthorization(value: string) {
  instance.defaults.headers.authorization = `Bearer ${value}`;
}

export function unsetAuthorization() {
  instance.defaults.headers.authorization = undefined;
}

// POST /user/auth
export function authenticate(user: any) {
  return instance.post(`/user/auth?assoc=${ASSOC}`, user);
}

// POST /user/auth/refresh
export function refreshAuthentication(accessKey: string) {
  return new Promise((resolve, reject) => {
    instance
      .post(`/user/auth/refresh?assoc=${ASSOC}`, { access_key: accessKey })
      .then(resp => {
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
export function getMatch(id: string) {
  return instance.get(`/fixtures/${id}`);
}

// PATCH /fixtures/:id/games?vid=:fixture.competitionId
export function patchFixtureGames(fixture: any, payload: any) {
  return instance.patch(
    `/fixtures/${fixture.id}/games?vid=${fixture.competitionId}`,
    payload,
  );
}

// PUT /fixrures/:fixture.id/games?vid=:fixture.competitionId
export function putFixtureGames(fixture: any, games: any) {
  return new Promise((resolve, reject) => {
    instance
      .put(`/fixtures/${fixture.id}/games?vid=${fixture.competitionId}`, games)
      .then((resp: any) => {
        resp.meta.games = _.keyBy(resp.meta.games, 'gameNumbers');
        resolve(resp);
      })
      .catch(reject);
  });
}

// POST /fixtures/:fixture.id/games?vid=:fixture.competitionId
export function postFixtureGames(fixture: any) {
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
export function getFixtureDates(fixture: any) {
  return instance.get(
    `/fixtures/${fixture.id}/dates?vid=${fixture.competitionId}`,
  );
}

// PUT /fixtures/:id/dates?vid=:fixture.comeptitionId
export function putFixtureDates(
  fixture: any,
  dates: any,
  minDates: number,
  maxDates: number,
) {
  return instance.put(
    `/fixtures/${fixture.id}/dates?vid=${fixture.competitionId}`,
    {
      dates,
      max_dates: maxDates,
      min_dates: minDates,
    },
  );
}

// PATCH /fixtures/:fixture.id/date?vid=:fixture.competitionId
export function patchFixtureDate(fixture: any, datetimeId: string) {
  return instance.patch(
    `/fixtures/${fixture.id}/date?vid=${fixture.competitionId}`,
    {
      datetime: { id: datetimeId },
    },
  );
}

// GET /teams/{id}
export function getTeam(id: string) {
  return instance.get(`/teams/${id}`);
}

// GET /teams/{id}/matches
export function getTeamMatches(id: string) {
  return instance.get(`/teams/${id}/fixtures`);
}

// GET /leagues
export function getLeagues() {
  return instance.get(`/competitions?assoc=${ASSOC}`);
}

// GET /leagues/{id}
export function getLeague(id: string) {
  return instance.get(`/competitions/${id}`);
}

// GET /leagues/{id}/matches
export function getLeagueMatches(id: string) {
  return instance.get(`/competitions/${id}`);
}

// GET /leagues/{id}/players
export function getLeaguePlayers(id: string) {
  return instance.get(`/competitions/${id}/stats`);
}

// GET /players/{id}
export function getPlayer(id: string) {
  return instance.get(`/players/${id}`);
}

/* Route Notifications */
// PUT /notidications
export function putNotification(
  token: string,
  enabled: boolean,
  sound: boolean,
  interimResults: boolean,
  finalResults: boolean,
) {
  return instance.put(`/notifications?assoc=${ASSOC}`, {
    enabled,
    final_results: finalResults,
    interim_results: interimResults,
    sound,
    token,
  });
}

// POST /notifications/fixture/:fixtureId
export function postNotificationFixture(fixtureId: string) {
  return instance.post(`/notifications/fixture/${fixtureId}`);
}

// DELETE /notifications/fixture/:fixtureId
export function deleteNotificationFixture(fixtureId: string) {
  return instance.delete(`/notifications/fixture/${fixtureId}`);
}

// POST /notifications/team/:teamId
export function postNotificationTeam(teamId: string) {
  return instance.post(`/notifications/team/${teamId}`);
}

export function deleteNotificationTeam(teamId: string) {
  return instance.delete(`/notifications/team/${teamId}`);
}
