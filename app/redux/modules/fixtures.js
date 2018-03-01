import _ from 'lodash';
const FETCH_FIXTURES = 'fixtures/FETCH';
const SET_FIXTURES = 'fixtures/SET';
const SET_FIXTURE_DATA = 'fixtures/SET_DATA';
const SET_FIXTURE_META = 'fixtures/SET_META';
const SET_FIXTURE_STATUS_IN_PLAY = 'fixtures/SET_STATUS_IN_PLAY';
const SET_FIXTURE_MODUS = 'fixture/SET_FIXTURE_MODUS';
const SET_FIXTURE_GAME_HOME_PLAYER = 'fixture/SET_GAME_HOME_PLAYER';
const SET_FIXTURE_GAME_AWAY_PLAYER = 'fixture/SET_GAME_AWAY_PLATER';
export const SET_FIXTURE_GAME_RESULT = 'fixture/SET_GAME_RESULT';
const SET_FIXTURE_DATES = 'fixture/SET_DATES';
const SET_FIXTURE_DATE = 'fixture/SET_DATE';
const REMOVE_FIXTURE_DATE = 'fixture/REMOVE_DATE';
export const SUGGEST_FIXTURE_DATES = 'fixture/SUGGEST_DATES';
export const ACCEPT_FIXTURE_DATE = 'fixture/ACCEPT_DATE';
export const SUGGEST_FIXTURE_RESULT = 'fixture/SUGGEST_RESULT';
export const ACCEPT_FIXTURE_RESULT = 'fixture/ACCEPT_RESULT';

// notif actions
const FIXTURE_RESULT_CHANGED = 'FIXTURE_RESULT_CHANGED';

export const fetchFixtures = assoc => ({
  type: FETCH_FIXTURES,
  payload: { assoc },
});

export const setFixtures = fixtures => ({
  type: SET_FIXTURES,
  payload: { fixtures },
});

export const setFixtureData = fixture => ({
  type: SET_FIXTURE_DATA,
  payload: { fixture },
});

export const setFixtureMeta = (id, meta) => ({
  type: SET_FIXTURE_META,
  payload: { id, meta },
});

export const setFixtureStatusInPlay = id => ({
  type: SET_FIXTURE_STATUS_IN_PLAY,
  payload: { id },
});

export const setFixtureModus = (id, modus, resetGameNumbers) => ({
  type: SET_FIXTURE_MODUS,
  payload: { id, modus, resetGameNumbers },
});

export const setFixtureGameHomePlayer = (id, gameNumbers, player) => ({
  type: SET_FIXTURE_GAME_HOME_PLAYER,
  payload: { id, gameNumbers, player },
});

export const setFixtureGameAwayPlayer = (id, gameNumbers, player) => ({
  type: SET_FIXTURE_GAME_AWAY_PLAYER,
  payload: { id, gameNumbers, player },
});

export const setFixtureGameResult = (id, gameNumber, result) => ({
  type: SET_FIXTURE_GAME_RESULT,
  payload: { id, gameNumber, result },
});

export const setFixtureDates = (id, dates) => ({
  type: SET_FIXTURE_DATES,
  payload: { id, dates },
});

export const setFixtureDate = (id, index, date) => ({
  type: SET_FIXTURE_DATE,
  payload: { id, index, date },
});

export const removeFixtureDate = (id, index) => ({
  type: REMOVE_FIXTURE_DATE,
  payload: { id, index },
});

export const suggestFixtureDates = id => ({
  type: SUGGEST_FIXTURE_DATES,
  payload: { id },
});

export const acceptFixtureDate = (fixtureId, datetimeId) => ({
  type: ACCEPT_FIXTURE_DATE,
  payload: { fixtureId, datetimeId },
});

export const suggestFixtureResult = id => ({
  type: SUGGEST_FIXTURE_RESULT,
  payload: { id },
});

export const acceptFixtureResult = id => ({
  type: ACCEPT_FIXTURE_RESULT,
  payload: { id },
});

const defaultState = {
  data: {},
  meta: {},
  dates: {},
};

export default function reducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_FIXTURES:
      return {
        ...state,
        data: { ...state.data, ...payload.fixtures },
      };
    case SET_FIXTURE_DATA:
      return {
        ...state,
        data: { ...state.data, [payload.fixture.id]: payload.fixture },
      };
    case SET_FIXTURE_META:
      return {
        ...state,
        meta: { ...state.meta, [payload.id]: payload.meta },
      };

    case SET_FIXTURE_STATUS_IN_PLAY:
      return {
        ...state,
        data: {
          ...state.data,
          [payload.id]: { ...state.data[payload.id], status: 'IN_PLAY' },
        },
      };
    case SET_FIXTURE_GAME_HOME_PLAYER:
      for (let gameNumber of payload.gameNumbers) {
        state = {
          ...state,
          meta: {
            ...state.meta,
            [payload.id]: {
              ...state.meta[payload.id],
              games: {
                ...state.meta[payload.id].games,
                [gameNumber]: {
                  ...state.meta[payload.id].games[gameNumber],
                  gameNumber,
                  homePlayer1: payload.player[0],
                  homePlayer2: payload.player[1],
                },
              },
            },
          },
        };
      }
      return state;
    case SET_FIXTURE_GAME_AWAY_PLAYER:
      for (let gameNumber of payload.gameNumbers) {
        state = {
          ...state,
          meta: {
            ...state.meta,
            [payload.id]: {
              ...state.meta[payload.id],
              games: {
                ...state.meta[payload.id].games,
                [gameNumber]: {
                  ...state.meta[payload.id].games[gameNumber],
                  gameNumber,
                  awayPlayer1: payload.player[0],
                  awayPlayer2: payload.player[1],
                },
              },
            },
          },
        };
      }
      return state;

    case SET_FIXTURE_GAME_RESULT:
      return {
        ...state,
        meta: {
          ...state.meta,
          [payload.id]: {
            ...state.meta[payload.id],
            games: {
              ...state.meta[payload.id].games,
              [payload.gameNumber]: {
                ...state.meta[payload.id].games[payload.gameNumber],
                gameNumber: payload.gameNumber,
                result: payload.result,
              },
            },
          },
        },
      };

    case SET_FIXTURE_MODUS:
      state = {
        ...state,
        meta: {
          ...state.meta,
          [payload.id]: {
            ...state.meta[payload.id],
            modus: {
              ...state.meta[payload.id].modus,
              fixtureModus: payload.modus,
            },
          },
        },
      };
      for (let gameNumber of payload.resetGameNumbers) {
        state = {
          ...state,
          meta: {
            ...state.meta,
            [payload.id]: {
              ...state.meta[payload.id],
              games: {
                ...state.meta[payload.id].games,
                [gameNumber]: undefined,
              },
            },
          },
        };
      }
      return state;

    case FIXTURE_RESULT_CHANGED:
      return {
        ...state,
        data: {
          ...state.data,
          [payload.fixture_id]: {
            ...state.data[payload.fixture_id],
            result: {
              setPointsHomeTeam: parseInt(payload.set_points_home_team),
              setPointsAwayTeam: parseInt(payload.set_points_away_team),
              goalsHomeTeam: parseInt(payload.goals_home_team),
              goalsAwayTeam: parseInt(payload.goals_away_team),
            },
          },
        },
      };

    case SET_FIXTURE_DATES:
      return {
        ...state,
        dates: {
          ...state.dates,
          [payload.id]: payload.dates,
        },
      };

    case SET_FIXTURE_DATE:
      return {
        ...state,
        dates: {
          ...state.dates,
          [payload.id]: {
            ...state.dates[payload.id],
            dates: [
              ...state.dates[payload.id].dates.slice(0, payload.index),
              { datetime: payload.date },
              ...state.dates[payload.id].dates.slice(payload.index + 1),
            ],
            meta: {
              ...state.dates[payload.id].meta,
              adminAccept: false,
            },
          },
        },
      };
    case REMOVE_FIXTURE_DATE:
      return {
        ...state,
        dates: {
          ...state.dates,
          [payload.id]: {
            ...state.dates[payload.id],
            dates: [
              ...state.dates[payload.id].dates.slice(0, payload.index),
              ...state.dates[payload.id].dates.slice(payload.index + 1),
            ],
            meta: {
              ...state.dates[payload.id].meta,
              adminAccept: false,
            },
          },
        },
      };
    default:
      return state;
  }
}

/* selectors */
const get = state => state.fixtures;
export const getFixture = (state, id) => get(state).data[id] || {};
export const getFixtureModus = (state, id) =>
  get(state).meta[id]
    ? get(state).meta[id].modus
    : {
        lineUp: {},
      };
export const getFixtureGames = (state, id) => get(state).meta[id].games || {};
export const getFixtureGame = (state, id, gameNumber) =>
  getFixtureGames(state, id)[gameNumber] || {
    gameNumber,
    homePlayer1: null,
    homePlayer2: null,
    awayPlayer1: null,
    awayPlayer2: null,
    result: null,
  };
export const getFixturePlayerHomeList = (state, id) =>
  getFixturePlayerList(state, id, 'home');
export const getFixturePlayerAwayList = (state, id) =>
  getFixturePlayerList(state, id, 'away');
export const getFixtureVenue = (state, id) =>
  get(state).meta[id] && get(state).meta[id].venue
    ? get(state).meta[id].venue
    : null;
export const getFirstFixture = (state, id) =>
  get(state).meta[id] && get(state).meta[id].firstFixture
    ? get(state).meta[id].firstFixture
    : null;
export const getFixturePlayerList = (state, id, key) =>
  get(state).meta[id] &&
  get(state).meta[id].player &&
  get(state).meta[id].player[key]
    ? get(state).meta[id].player[key]
    : [];
export const getFixtureDates = (state, id) => get(state).dates[id] || null;
