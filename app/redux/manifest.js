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
};

export const APP_KEY = 'app';
