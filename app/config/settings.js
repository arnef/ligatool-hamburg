require('moment/locale/de');
import moment from 'moment';
import { Platform } from 'react-native';

moment.locale('de');

export const URL = __DEV__
  ? `http://localhost${Platform.OS === 'android' ? ':3000' : ''}/liga-tool`
  : 'https://kickern-hamburg.de/de/competitions';

export const DATETIME = 'dd. DD.MM.YY HH:mm';
export const DATE_FORMAT = 'dd. DD.MM.YY';
