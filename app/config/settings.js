require('moment/locale/de');
import moment from 'moment';
import { Platform } from 'react-native';

moment.locale('de');

// api
export const URL = __DEV__
  ? `http://localhost${Platform.OS === 'android' ? ':3000' : ''}/liga-tool`
  : 'https://kickern-hamburg.de/de/competitions';

// date format
export const DATETIME_FORMAT = 'dd. DD.MM.YY HH:mm';
export const DATE_FORMAT = 'dd. DD.MM.YY';

// sets
export const WITH_DRAW = true;
export const DRAW_GOALS = 5;
export const WIN_GOALS = 6;
