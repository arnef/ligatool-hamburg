// @flow

export default {
  '1': (state: any) => ({ ...state }),
  '2': (state: any) => ({
    ...state,
    matches: {},
    settings: {
      ...state.settings,
      changed: true,
      notification: {
        ...state.settings.notification,
        matchdate:
          state.settings.notification.on && state.auth.api_key ? true : false,
      },
    },
  }),
};

export const APP_KEY = 'app';
