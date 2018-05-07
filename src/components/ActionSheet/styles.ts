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

import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  outside: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    marginTop: Math.round(Dimensions.get('window').height * 0.25),
  },
});
