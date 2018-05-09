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

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  barContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  draws: {
    alignItems: 'center',
    backgroundColor: 'rgba(237, 140, 42, .7)',
    justifyContent: 'center',
  },
  lost: {
    alignItems: 'center',
    backgroundColor: 'rgba(207, 74, 48, .7)',
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 10,
  },
  wins: {
    alignItems: 'center',
    backgroundColor: 'rgba(136, 168, 37, .7)',
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    justifyContent: 'center',
  },
});
