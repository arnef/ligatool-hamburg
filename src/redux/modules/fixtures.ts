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

import { DATETIME_DB } from '@app/config/settings';
import moment from 'moment';

const FETCH_FIXTURES = 'fixtures/FETCH';
export const SET_FIXTURES = 'fixtures/SET';
export const SET_FIXTURE_DATA = 'fixtures/SET_DATA';
const SET_FIXTURE_META = 'fixtures/SET_META';
const SET_FIXTURE_STATUS_IN_PLAY = 'fixtures/SET_STATUS_IN_PLAY';
const SET_FIXTURE_MODUS = 'fixture/SET_FIXTURE_MODUS';
const SET_FIXTURE_GAME_HOME_PLAYER = 'fixture/SET_GAME_HOME_PLAYER';
export const SET_FIXTURE_GAME_AWAY_PLAYER = 'fixture/SET_GAME_AWAY_PLATER';
export const SET_FIXTURE_GAME_RESULT = 'fixture/SET_GAME_RESULT';
const SET_FIXTURE_DATES = 'fixture/SET_DATES';
const SET_FIXTURE_DATE = 'fixture/SET_DATE';
const REMOVE_FIXTURE_DATE = 'fixture/REMOVE_DATE';
export const SUGGEST_FIXTURE_DATES = 'fixture/SUGGEST_DATES';
export const ACCEPT_FIXTURE_DATE = 'fixture/ACCEPT_DATE';
export const SUGGEST_FIXTURE_RESULT = 'fixture/SUGGEST_RESULT';
export const ACCEPT_FIXTURE_RESULT = 'fixture/ACCEPT_RESULT';
import _ from 'lodash';
const SET_OVERVIEW = 'fixture/overview';
// notif actions
const FIXTURE_RESULT_CHANGED = 'FIXTURE_RESULT_CHANGED';

export const GET_MATCH = 'ligatool/modules/GET_MATCH';
export const GET_MATCH_DONE = 'ligatool/modules/GET_MATCH_DONE';
export const SUGGEST_DATETIME = 'ligatool/matches/SUGGEST_DATETIME';

export const setOverview = (overview: any) => ({
  payload: { overview },
  type: SET_OVERVIEW,
});
export const fetchFixtures = (assoc: string) => ({
  payload: { assoc },
  type: FETCH_FIXTURES,
});

export const setFixtures = (fixtures: any) => ({
  payload: { fixtures },
  type: SET_FIXTURES,
});

export const setFixtureData = (fixture: any) => ({
  payload: { fixture },
  type: SET_FIXTURE_DATA,
});

export const setFixtureMeta = (id: string, meta: any) => ({
  payload: { id, meta },
  type: SET_FIXTURE_META,
});

export const setFixtureStatusInPlay = (id: string) => ({
  payload: { id },
  type: SET_FIXTURE_STATUS_IN_PLAY,
});

export const setFixtureModus = (
  id: string,
  modus: any,
  resetGameNumbers: string[],
) => ({
  payload: { id, modus, resetGameNumbers },
  type: SET_FIXTURE_MODUS,
});

export const setFixtureGameHomePlayer = (
  id: string,
  gameNumbers: string[],
  player: any,
) => ({
  payload: { id, gameNumbers, player },
  type: SET_FIXTURE_GAME_HOME_PLAYER,
});

export const setFixtureGameAwayPlayer = (
  id: string,
  gameNumbers: string[],
  player: any,
) => ({
  payload: { id, gameNumbers, player },
  type: SET_FIXTURE_GAME_AWAY_PLAYER,
});

export const setFixtureGameResult = (
  id: string,
  gameNumber: string,
  result: any,
) => ({
  payload: { id, gameNumber, result },
  type: SET_FIXTURE_GAME_RESULT,
});

export const setFixtureDates = (id: string, dates: any) => ({
  payload: { id, dates },
  type: SET_FIXTURE_DATES,
});

export const setFixtureDate = (id: string, index: number, date: string) => ({
  payload: { id, index, date },
  type: SET_FIXTURE_DATE,
});

export const removeFixtureDate = (id: string, index: number) => ({
  payload: { id, index },
  type: REMOVE_FIXTURE_DATE,
});

export const suggestFixtureDates = (id: string) => ({
  payload: { id },
  type: SUGGEST_FIXTURE_DATES,
});

export const acceptFixtureDate = (fixtureId: string, datetimeId: string) => ({
  payload: { fixtureId, datetimeId },
  type: ACCEPT_FIXTURE_DATE,
});

export const suggestFixtureResult = (id: string) => ({
  payload: { id },
  type: SUGGEST_FIXTURE_RESULT,
});

export const acceptFixtureResult = (id: string) => ({
  payload: { id },
  type: ACCEPT_FIXTURE_RESULT,
});

export interface IFixtureState {
  data: { [id: string]: any };
  overview: any;
  meta: { [id: string]: any };
  dates: { [id: string]: any };
}

const defaultState: IFixtureState = {
  data: {},
  dates: {},
  meta: {},
  overview: null,
};

export default function reducer(
  state: IFixtureState = defaultState,
  action: any,
) {
  const { type, payload } = action;

  switch (type) {
    case SET_OVERVIEW:
      return { ...state, overview: payload.overview };
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
        meta: {
          ...state.meta,
          [payload.id]: mergeGames(state.meta[payload.id], payload.meta),
        },
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
      for (const gameNumber of payload.gameNumbers) {
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
      for (const gameNumber of payload.gameNumbers) {
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
                  awayPlayer1: payload.player[0],
                  awayPlayer2: payload.player[1],
                  gameNumber,
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
      for (const gameNumber of payload.resetGameNumbers) {
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
              goalsAwayTeam: parseInt(payload.goals_away_team, 10),
              goalsHomeTeam: parseInt(payload.goals_home_team, 10),
              setPointsAwayTeam: parseInt(payload.set_points_away_team, 10),
              setPointsHomeTeam: parseInt(payload.set_points_home_team, 10),
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
const get = (state: any) => state.fixtures;
export const getFixture = (state: any, id: string) => get(state).data[id];
export const getFixtureModus = (state: any, id: string) =>
  get(state).meta[id] ? get(state).meta[id].modus : null;
export const getFixtureGames = (state: any, id: string) =>
  get(state).meta[id].games || {};
export const getFixtureDefaultLineUp = (state: any, id: string) =>
  get(state).meta[id] &&
  get(state).meta[id].modus.lineUp &&
  get(state).meta[id].modus.lineUp.default
    ? get(state).meta[id].modus.lineUp.default
    : [];
export const getFixtureGame = (state: any, id: string, gameNumber: string) =>
  getFixtureGames(state, id)[gameNumber] || {
    awayPlayer1: null,
    awayPlayer2: null,
    gameNumber,
    homePlayer1: null,
    homePlayer2: null,
    result: null,
  };
export const getFixturePlayerHomeList = (state: any, id: string) =>
  getFixturePlayerList(state, id, 'home');
export const getFixturePlayerAwayList = (state: any, id: string) =>
  getFixturePlayerList(state, id, 'away');
export const getFixtureVenue = (state: any, id: string) =>
  get(state).meta[id] && get(state).meta[id].venue
    ? get(state).meta[id].venue
    : null;
export const getFirstFixture = (state: any, id: string) =>
  get(state).meta[id] && get(state).meta[id].firstFixture
    ? get(state).meta[id].firstFixture
    : null;
export const getFixturePlayerList = (state: any, id: string, key: string) =>
  get(state).meta[id] &&
  get(state).meta[id].player &&
  get(state).meta[id].player[key]
    ? _.sortBy(get(state).meta[id].player[key], 'name')
    : [];
export const getFixtureDates = (state: any, id: string) =>
  get(state).dates[id] || null;

export const getFixtureByFilter = (state: any, filter: string) => {
  if (!get(state).overview) {
    return null;
  }

  return get(state).overview[filter];
};
export const getFixtureByTeam = (state: string, teamGoupId: string) => {
  const fixtures = [];
  for (const id in get(state).data) {
    if (id) {
      const fixture = getFixture(state, id);
      if (
        teamGoupId === fixture.homeTeamGroupId ||
        teamGoupId === fixture.awayTeamGroupId ||
        teamGoupId === fixture.homeTeamId ||
        teamGoupId === fixture.awayTeamId
      ) {
        fixtures.push(fixture);
      }
    }
  }
  return fixtures.sort(fixtureSort);
};

export const getNextFixturesByTeam = (state: any, teamGroupId: string) => {
  const fixtures = getFixtureByTeam(state, teamGroupId);
  if (fixtures.length === 0) {
    return null;
  }

  return _.filter(fixtures, f => f.status !== STATUS_CONFIRMED);
};

export const getPlayedFixturesByTeam = (state: any, teamGoupId: string) => {
  const fixtures = getFixtureByTeam(state, teamGoupId);
  if (fixtures.length === 0) {
    return null;
  }
  return _.filter(fixtures, f => f.status === STATUS_CONFIRMED);
};

export const getFixturesByCompetition = (state: any, competitionId: string) => {
  const fixtures = [];
  for (const id in get(state).data) {
    if (id) {
      const fixture = getFixture(state, id);
      if (fixture.competitionId === competitionId) {
        fixtures.push(fixture);
      }
    }
  }
  return fixtures.sort(fixtureSort);
};

//
export const FILTER_TODAY = 'today';
export const FILTER_PASSED = 'passed';
export const FILTER_UPCOMMING = 'upcomming';

export const STATUS_SCHEDUELED = 'SCHEDUELED';
export const STATUS_POSTPONED = 'POSTPONED';
export const STATUS_IN_PLAY = 'IN_PLAY';
export const STATUS_FINISHED = 'FINISHED';
export const STATUS_CONFIRMED = 'CONFIRMED';

/* helper */
function mergeGames(state: any, payload: any) {
  if (!state) {
    return payload;
  }

  return {
    ...payload,
    games: { ...state.games, ...payload.games },
  };
}
export const fixtureSort = (a: any, b: any) => {
  let sort = statusValue(b.status) - statusValue(a.status);
  if (sort === 0) {
    if (
      a.status === STATUS_IN_PLAY ||
      a.status === STATUS_CONFIRMED ||
      a.status === STATUS_FINISHED
    ) {
      sort =
        moment(b.date, DATETIME_DB).unix() - moment(a.date, DATETIME_DB).unix();
    } else {
      sort =
        moment(a.date, DATETIME_DB).unix() - moment(b.date, DATETIME_DB).unix();
    }
  }
  return sort;
};

const statusValue = (status: string) => {
  switch (status) {
    case STATUS_IN_PLAY:
      return 5;
    case STATUS_FINISHED:
      return 4;
    case STATUS_POSTPONED:
      return 3;
    case STATUS_SCHEDUELED:
      return 2;
    case STATUS_CONFIRMED:
      return 1;
  }
};
