/**
 * Copyright (C) 2018 Arne Feil
 *
 * This file is part of DTFB App.
 *
 * DTFB App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DTFB App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DTFB App.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { defaultColor } from '@app/config/settings';

import { LOGOUT_DONE } from './auth';

// Actions
export const FETCH_USER_TEAM = 'ligatool/modules/FETCH_USER_TEAM';
const SET_TEAM = 'ligatool/modules/SET_TEAM';
export const TOGGLE_NOTIFICATION = 'settings/TOGGLE_NOTIFICATION_KEY';
const TOGGLE_GROUP_NOTIFICATION = 'ligatool/settings/TOGGLE_GROUP_NOTIFICATION';
const SYNCHRONIZED = 'ligatool/settings/SYNCHRONIZED';
export const SET_FCM_TOKEN = 'ligatool/settings/SET_FCM_TOKEN';
export const COMPLETE_SETUP = 'ligatool/settings/COMPLETE_SETUP';
const SET_NOTIFICATION = 'ligatool/settings/SET_NOTIFICATION';
export const SUBSCRIBE_FIXTURE = 'settings/SUBSCRIBE_FIXTURE';
export const UNSUBSCRIBE_FIXTURE = 'settings/UNSUBSCRIBE_FIXTURE';
export const SUBSCRIBE_TEAM = 'settings/SUBSCRIBE_TEAM';
export const UNSUBSCRIBE_TEAM = 'settings/UNSUBSCRIBE/TEAM';
export const DISABLE_NOTIFICATION_FIXTURE =
  'settings/DISABLE_NOTIFICATION_FIXTURE';
export const ENABLE_NOTIFICATION_FOR_FIXTURE =
  'settings/ENABLE_NOTIFICATION_FOR_FIXTURE';

const defaultState: ISettingsState = {
  changed: false,
  color: defaultColor,
  fcm_token: null,
  notification: {
    disabledFixtures: [],
    enabled: true,
    finalResults: true,
    fixtures: [],
    interimResults: true,
    sound: true,
    teams: [],
  },
  team: null,
};

export interface ISettingsState {
  color: string;
  changed: boolean;
  notification: {
    disabledFixtures: string[];
    enabled: boolean;
    finalResults: boolean;
    fixtures: string[];
    interimResults: boolean;
    sound: boolean;
    teams: string[];
    [key: string]: any; // TODO: quickfix
  };
  fcm_token?: string;
  team?: any;
}

// Reducer
export default function reducer(
  state: ISettingsState = defaultState,
  action: any,
) {
  const { type, payload } = action;
  switch (type) {
    case LOGOUT_DONE:
      state = { ...state, color: defaultColor, team: null };
      break;
    case SET_TEAM:
      state = {
        ...state,
        color: action.payload.color || defaultColor,
        team: action.payload,
      };
      break;
    case TOGGLE_NOTIFICATION:
      state = {
        ...state,
        changed: true,
        notification: {
          ...state.notification,
          [action.payload.key]: !state.notification[action.payload.key],
        },
      };
      break;
    case TOGGLE_GROUP_NOTIFICATION:
      if (!state.notification.leagues) {
        state = {
          ...state,
          notification: { ...state.notification, leagues: {} },
        };
      }
      state = {
        ...state,
        changed: true,
        notification: {
          ...state.notification,
          leagues: {
            ...state.notification.leagues,
            [action.payload.key]: !state.notification.leagues[
              action.payload.key
            ],
          },
        },
      };
      break;
    case SET_FCM_TOKEN:
      state = { ...state, fcm_token: action.payload.fcm_token };
      break;
    case SYNCHRONIZED:
      state = { ...state, changed: false };
      break;
    case SET_NOTIFICATION:
      state = {
        ...state,
        changed: true,
        notification: { ...state.notification, ...action.payload },
      };
      break;

    case SUBSCRIBE_FIXTURE:
      return {
        ...state,
        notification: {
          ...state.notification,
          fixtures: [...state.notification.fixtures, payload.fixtureId],
        },
      };
    case DISABLE_NOTIFICATION_FIXTURE:
      return {
        ...state,
        notification: {
          ...state.notification,
          disabledFixtures: [
            ...state.notification.disabledFixtures,
            payload.fixtureId,
          ],
        },
      };
    case UNSUBSCRIBE_FIXTURE:
      return {
        ...state,
        notification: {
          ...state.notification,
          fixtures: [
            ...state.notification.fixtures.slice(
              0,
              state.notification.fixtures.indexOf(payload.fixtureId),
            ),
            ...state.notification.fixtures.slice(
              state.notification.fixtures.indexOf(payload.fixtureId) + 1,
            ),
          ],
        },
      };
    case ENABLE_NOTIFICATION_FOR_FIXTURE:
      return {
        ...state,
        notification: {
          ...state.notification,
          disabledFixtures: [
            ...state.notification.disabledFixtures.slice(
              0,
              state.notification.disabledFixtures.indexOf(payload.fixtureId),
            ),
            ...state.notification.disabledFixtures.slice(
              state.notification.disabledFixtures.indexOf(payload.fixtureId) +
                1,
            ),
          ],
        },
      };
    case SUBSCRIBE_TEAM:
      return {
        ...state,
        notification: {
          ...state.notification,
          teams: [...state.notification.teams, payload.id],
        },
      };
    case UNSUBSCRIBE_TEAM:
      return {
        ...state,
        notification: {
          ...state.notification,
          teams: [
            ...state.notification.teams.slice(
              0,
              state.notification.teams.indexOf(payload.id),
            ),
            ...state.notification.teams.slice(
              state.notification.teams.indexOf(payload.id) + 1,
            ),
          ],
        },
      };
  }
  return state;
}

// Action Creators
export function fetchUserTeam(teamId: any) {
  return { type: FETCH_USER_TEAM, payload: { teamId } };
}

export function setTeam(team: any) {
  return { type: SET_TEAM, payload: team };
}

export function toggleNotification(key: string) {
  return { type: TOGGLE_NOTIFICATION, payload: { key: `${key}` } };
}

export function toggleGroupNotification(key: string) {
  return { type: TOGGLE_GROUP_NOTIFICATION, payload: { key: `${key}` } };
}

export function synchronized() {
  return { type: SYNCHRONIZED };
}

export function setFCMToken(fcmToken: string) {
  return {
    payload: { fcm_token: fcmToken },
    type: SET_FCM_TOKEN,
  };
}

export function completeSetup() {
  return { type: COMPLETE_SETUP };
}

export function setNotification(payload: any) {
  return { type: SET_NOTIFICATION, payload };
}

export const subscribeFixture = (fixtureId: string) => ({
  payload: { fixtureId },
  type: SUBSCRIBE_FIXTURE,
});

export const unsubscribeFixture = (fixtureId: string) => ({
  payload: { fixtureId },
  type: UNSUBSCRIBE_FIXTURE,
});

export const disableNotificationFixture = (fixtureId: string) => ({
  payload: { fixtureId },
  type: DISABLE_NOTIFICATION_FIXTURE,
});

export const enableNotificationFixture = (fixtureId: string) => ({
  payload: { fixtureId },
  type: ENABLE_NOTIFICATION_FOR_FIXTURE,
});

export const subscribeTeam = (team: any) => ({
  payload: { id: team.groupId || team.id },
  type: SUBSCRIBE_TEAM,
});

export const unsubscribeTeam = (team: any) => ({
  payload: { id: team.groupId || team.id },
  type: UNSUBSCRIBE_TEAM,
});

/* Selectors */
const get = (state: any) => state.settings;
export const getFCMToken = (state: any) => get(state).fcm_token;

export const notificationEnabled = (state: any) =>
  get(state).fcm_token && get(state).notification.enabled;

export const notificationSound = (state: any) => get(state).notification.sound;

export const notificationInterimResults = (state: any) =>
  get(state).notification.interimResults;

export const notificationFinalResults = (state: any) =>
  get(state).notification.finalResults;

export const notificationSubscribedForFixtureByFixture = (
  state: any,
  fixture: any,
) =>
  get(state).notification.fixtures &&
  get(state).notification.fixtures.indexOf(fixture.id) !== -1;

export const notificationDisabledFixture = (state: any, fixtureId: string) =>
  get(state).notification.disabledFixtures &&
  get(state).notification.disabledFixtures.indexOf(fixtureId) !== -1;

export const notificationSubscribedForFixture = (state: any, fixture: any) =>
  (notificationSubscribedForFixtureByFixture(state, fixture) ||
    notificationSubscribedForFixtureByTeam(state, fixture)) &&
  !notificationDisabledFixture(state, fixture.id);

export const notificationSubscribedForFixtureByTeam = (
  state: any,
  fixture: any,
) =>
  get(state).notification.teams &&
  (get(state).notification.teams.indexOf(fixture.homeTeamId) !== -1 ||
    get(state).notification.teams.indexOf(fixture.awayTeamId) !== -1 ||
    get(state).notification.teams.indexOf(fixture.homeTeamGroupId) !== -1 ||
    get(state).notification.teams.indexOf(fixture.awayTeamGroupId) !== -1);

export const notificationSubscribedForTeam = (state: any, team: any) =>
  get(state).notification.teams.indexOf(team.groupId || team.id) !== -1;
