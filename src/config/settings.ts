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

import 'moment/locale/de';

import moment from 'moment';

moment.locale('de');

// api
// export const URL = 'https://api.kickern.online';
export const URL = 'http://localhost:9001';
// theme and assoc
export const ASSOC = 'tfvhh-test';
// export const ASSOC = 'dtfb-test';
export const defaultColor = '#006600';

// date format
export const DATETIME_DB = 'YYYY-MM-DD HH:mm:ss';
export const DATETIME_FORMAT = 'dd. DD.MM.YY HH:mm';
export const DATE_FORMAT = 'dd. DD.MM.YY';
