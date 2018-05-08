import { defaultColor } from '@app/config/settings';

const SET_API_KEY = 'user/ADD_API_KEY';
const SET_TOKEN = 'user/SET_TOKEN';
const USER_ADD_TEAM = 'user/ADD_TEAM';
export const USER_REMOVE_TEAM = 'user/REMOVE_TEAM';
const SET_ACTIVE_TEAM = 'user/SET_ACTIVE_TEAM';

export const userSetApiKey = apiKey => ({
  type: SET_API_KEY,
  payload: { apiKey },
});

export const userSetToken = (token, ids, expires) => ({
  type: SET_TOKEN,
  payload: { token, ids, expires },
});

export const userAddTeam = team => ({
  type: USER_ADD_TEAM,
  payload: { team },
});

export const userRemoveTeam = index => ({
  type: USER_REMOVE_TEAM,
  payload: { index },
});

export const userSetActiveTeam = index => ({
  type: SET_ACTIVE_TEAM,
  payload: { index },
});

const defaultState = {
  teams: [],
  active: -1,
};

export default function reducer(state = defaultState, action) {
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
              token: payload.token,
              ids: payload.ids,
              expires: payload.expires,
            },
          },
          ...state.teams.slice(state.active + 1),
        ],
      };

    case USER_ADD_TEAM:
      return {
        ...state,
        teams: [
          ...state.teams,
          {
            id: payload.team.id,
            groupId: payload.team.groupId,
            name: payload.team.name,
            emblemUrl: payload.team.emblemUrl,
            color: payload.team.color,
            access: null,
          },
        ],
        active: state.teams.length,
      };

    case USER_REMOVE_TEAM:
      return {
        ...state,
        teams: [
          ...state.teams.slice(0, payload.index),
          ...state.teams.slice(payload.index + 1),
        ],
        active:
          payload.index == state.active
            ? 0
            : payload.index < state.active
              ? state.active - 1
              : state.active,
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
const get = state => state.user;
export const accessForTeams = state =>
  get(state).active > -1 &&
  get(state).teams[get(state).active] &&
  get(state).teams[get(state).active].access &&
  get(state).teams[get(state).active].access.ids
    ? get(state).teams[get(state).active].access.ids
    : [];

export const getColor = state =>
  get(state).active > -1 &&
  get(state).teams[get(state).active] &&
  get(state).teams[get(state).active].color
    ? get(state).teams[get(state).active].color
    : defaultColor;

export const getUserTeams = state => (get(state) ? get(state).teams : null);

export const getActiveTeam = state =>
  get(state).active > -1 && get(state).teams[get(state).active]
    ? get(state).teams[get(state).active]
    : null;

export const getActiveTeamGroup = state => {
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
// get(state).active > -1 && get(state).teams[get(state).active]
//   ? (get(state).teams[get(state).active].groupId || get(state).teams[get(state).active].id)
//   : null;
