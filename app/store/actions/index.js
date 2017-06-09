// @flow
import * as match from './matchActions';
import * as login from './login';
import * as settings from './settingsActions';
import * as team from './teamActions';
import * as dialog from './dialogActions';
import * as league from './leagueActions';
import * as auth from './authActions';
import * as fcm from './fcmActions';
import * as players from './playersActions';

export default {
  ...match,
  ...login,
  ...settings,
  ...team,
  ...dialog,
  ...league,
  ...auth,
  ...fcm,
  ...players,
};
