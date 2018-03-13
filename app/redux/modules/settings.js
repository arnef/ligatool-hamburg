import { LOGOUT_DONE } from './auth';
import { defaultColor } from '../../config/settings';

// const defaultColor = '#ef473a';
// const defaultColor = '#060060'; //dtfb green
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

const defaultState = {
  changed: false,
  color: defaultColor,
  notification: {
    enabled: true,
    sound: true,
    interimResults: true,
    finalResults: true,
    fixtures: [],
    teams: [],
    disabledFixtures: [],
  },
  fcm_token: null,
  team: null,
};

// Reducer
export default function reducer(state = defaultState, action) {
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
export function fetchUserTeam(teamId) {
  return { type: FETCH_USER_TEAM, payload: { teamId } };
}

export function setTeam(team) {
  return { type: SET_TEAM, payload: team };
}

export function toggleNotification(key) {
  return { type: TOGGLE_NOTIFICATION, payload: { key: `${key}` } };
}

export function toggleGroupNotification(key) {
  return { type: TOGGLE_GROUP_NOTIFICATION, payload: { key: `${key}` } };
}

export function synchronized() {
  return { type: SYNCHRONIZED };
}

export function setFCMToken(fcmToken) {
  return { type: SET_FCM_TOKEN, payload: { fcm_token: fcmToken } };
}

export function completeSetup() {
  return { type: COMPLETE_SETUP };
}

export function setNotification(payload) {
  return { type: SET_NOTIFICATION, payload };
}

export const subscribeFixture = fixtureId => ({
  type: SUBSCRIBE_FIXTURE,
  payload: { fixtureId },
});

export const unsubscribeFixture = fixtureId => ({
  type: UNSUBSCRIBE_FIXTURE,
  payload: { fixtureId },
});

export const disableNotificationFixture = fixtureId => ({
  type: DISABLE_NOTIFICATION_FIXTURE,
  payload: { fixtureId },
});

export const enableNotificationFixture = fixtureId => ({
  type: ENABLE_NOTIFICATION_FOR_FIXTURE,
  payload: { fixtureId },
});

export const subscribeTeam = team => ({
  type: SUBSCRIBE_TEAM,
  payload: { id: team.groupId || team.id },
});

export const unsubscribeTeam = team => ({
  type: UNSUBSCRIBE_TEAM,
  payload: { id: team.groupId || team.id },
});

/* Selectors */
const get = state => state.settings;
export const getFCMToken = state => get(state).fcm_token;

export const notificationEnabled = state =>
  get(state).fcm_token && get(state).notification.enabled;

export const notificationSound = state => get(state).notification.sound;

export const notificationInterimResults = state =>
  get(state).notification.interimResults;

export const notificationFinalResults = state =>
  get(state).notification.finalResults;

export const notificationSubscribedForFixtureByFixture = (state, fixture) =>
  get(state).notification.fixtures &&
  get(state).notification.fixtures.indexOf(fixture.id) !== -1;

export const notificationDisabledFixture = (state, fixtureId) =>
  get(state).notification.disabledFixtures &&
  get(state).notification.disabledFixtures.indexOf(fixtureId) !== -1;

export const notificationSubscribedForFixture = (state, fixture) =>
  (notificationSubscribedForFixtureByFixture(state, fixture) ||
    notificationSubscribedForFixtureByTeam(state, fixture)) &&
  !notificationDisabledFixture(state, fixture.id);

export const notificationSubscribedForFixtureByTeam = (state, fixture) =>
  get(state).notification.teams &&
  (get(state).notification.teams.indexOf(fixture.homeTeamId) !== -1 ||
    get(state).notification.teams.indexOf(fixture.awayTeamId) !== -1 ||
    get(state).notification.teams.indexOf(fixture.homeTeamGroupId) !== -1 ||
    get(state).notification.teams.indexOf(fixture.awayTeamGroupId) !== -1);

export const notificationSubscribedForTeam = (state, team) =>
  get(state).notification.teams.indexOf(team.groupId || team.id) !== -1;
