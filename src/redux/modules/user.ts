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
import { hex2hsl } from '@app/helper';

const SET_API_KEY = 'user/ADD_API_KEY';
const SET_TOKEN = 'user/SET_TOKEN';
const USER_ADD_TEAM = 'user/ADD_TEAM';
export const USER_REMOVE_TEAM = 'user/REMOVE_TEAM';
const SET_ACTIVE_TEAM = 'user/SET_ACTIVE_TEAM';

export const userSetApiKey = (apiKey: string) => ({
  payload: { apiKey },
  type: SET_API_KEY,
});

export const userSetToken = (
  token: string,
  ids: string[],
  expires: string,
) => ({
  payload: { token, ids, expires },
  type: SET_TOKEN,
});

export const userAddTeam = (team: any) => ({
  payload: { team },
  type: USER_ADD_TEAM,
});

export const userRemoveTeam = (index: number) => ({
  payload: { index },
  type: USER_REMOVE_TEAM,
});

export const userSetActiveTeam = (index: number) => ({
  payload: { index },
  type: SET_ACTIVE_TEAM,
});

export interface IUserState {
  active: number;
  teams: any[];
}

const defaultState: IUserState = {
  active: -1,
  teams: [],
};

export default function reducer(state = defaultState, action: any) {
  const { type, payload } = action;

  switch (type) {
    case SET_API_KEY:
      return {
        ...state,
        teams: [
          ...state.teams.slice(0, state.active),
          {
            ...state.teams[state.active],
            access: {
              ...state.teams[state.active].access,
              apiKey: payload.apiKey,
            },
          },
          ...state.teams.slice(state.active + 1),
        ],
      };

    case SET_TOKEN:
      return {
        ...state,
        teams: [
          ...state.teams.slice(0, state.active),
          {
            ...state.teams[state.active],
            access: {
              ...state.teams[state.active].access,
              expires: payload.expires,
              ids: payload.ids,
              token: payload.token,
            },
          },
          ...state.teams.slice(state.active + 1),
        ],
      };

    case USER_ADD_TEAM:
      return {
        ...state,
        active: state.teams.length,
        teams: [
          ...state.teams,
          {
            access: null,
            color: payload.team.color,
            emblemUrl: payload.team.emblemUrl,
            groupId: payload.team.groupId,
            id: payload.team.id,
            name: payload.team.name,
          },
        ],
      };

    case USER_REMOVE_TEAM:
      return {
        ...state,
        active:
          payload.index === state.active
            ? 0
            : payload.index < state.active
              ? state.active - 1
              : state.active,
        teams: [
          ...state.teams.slice(0, payload.index),
          ...state.teams.slice(payload.index + 1),
        ],
      };

    case SET_ACTIVE_TEAM:
      return {
        ...state,
        active: payload.index,
      };
    default:
      return state;
  }
}

/* selectors */
const get = (state: any) => state.user;
export const accessForTeams = (state: any) =>
  get(state).active > -1 &&
  get(state).teams[get(state).active] &&
  get(state).teams[get(state).active].access &&
  get(state).teams[get(state).active].access.ids
    ? get(state).teams[get(state).active].access.ids
    : [];

export const getColor = (state: any) => {
  const color =
    get(state).active > -1 &&
    get(state).teams[get(state).active] &&
    get(state).teams[get(state).active].color
      ? get(state).teams[get(state).active].color
      : defaultColor;
  if (color[0] === '#') {
    return hex2hsl(color);
  }
  return color;
};

export const getUserTeams = (state: any) =>
  get(state) ? get(state).teams : null;

export const getActiveTeam = (state: any) =>
  get(state).active > -1 && get(state).teams[get(state).active]
    ? get(state).teams[get(state).active]
    : null;

export const getActiveTeamGroup = (state: any) => {
  if (get(state).active > -1 && get(state).teams[get(state).active]) {
    const team = get(state).teams[get(state).active];
    if (team.id && team.groupId && team.groupId.indexOf('-') === -1) {
      const prefix = team.id.split('-', 1);
      return `${prefix}-${team.groupId}`;
    } else {
      return team.groupId || team.id;
    }
  }

  return null;
};
