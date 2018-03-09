import { getUserTeams } from './modules/user';

export default {
  '1': state => ({ ...state }),
  '2': state => ({
    ...state,
    matches: {},
    settings: {
      ...state.settings,
      changed: true,
      notification:
        state.settings && state.settings.notification
          ? {
              ...state.settings.notification,
              matchdate:
                state.settings.notification.on && state.auth.api_key
                  ? true
                  : false,
            }
          : {},
    },
  }),
  '4': state => ({
    ...state,
    settings: {
      ...state.settings,
      notification: {
        enabled: true,
        sound: true,
        interimResults: true,
        finalResults: true,
        fixtures: [],
      },
    },
  }),
  '5': state => {
    const userTeams = getUserTeams(state) || [];
    let teamIds = [];
    for (let team of userTeams) {
      if (team.groupId && team.groupId.indexOf('-') === -1) {
        const prefix = team.id.split('-', 1);
        teamIds = [...teamIds, `${prefix}-${team.groupId}`];
      } else {
        teamIds = [...teamIds, team.groupId];
      }
    }

    return {
      ...state,
      settings: {
        ...state.settings,
        notification: {
          ...state.settings.notification,
          teams: teamIds,
        },
      },
    };
  },
};

export const APP_KEY = 'app';
