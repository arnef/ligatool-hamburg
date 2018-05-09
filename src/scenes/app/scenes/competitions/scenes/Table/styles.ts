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
  container: {
    flex: 1,
  },
  goals: {
    textAlign: 'center',
    width: 35,
  },
  header: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  matches: {
    textAlign: 'center',
    width: 35,
  },
  points: {
    fontWeight: 'bold',
    textAlign: 'center',
    width: 35,
  },
  position: {
    fontWeight: 'bold',
    textAlign: 'center',
    width: 20,
  },
  row: {
    flexDirection: 'row',
  },
  setPoints: {
    textAlign: 'center',
    width: 40,
  },
  teamLogo: {
    width: 32 + 16,
  },
  teamName: {
    flex: 1,
  },
});
