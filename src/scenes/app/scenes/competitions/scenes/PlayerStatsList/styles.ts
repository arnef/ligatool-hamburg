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
  position: {
    alignItems: 'center',
    width: 20,
  },
  playerImage: {
    marginHorizontal: 8,
    width: 24,
  },
  row: {
    flexDirection: 'row',
  },
  playerName: {
    flex: 1,
  },
  rate: {
    width: 42,
    textAlign: 'center',
  },
  matches: {
    width: 38,
    textAlign: 'center',
  },
  competitiveIndex: {
    width: 38,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    marginVertical: 8,
  },
});
