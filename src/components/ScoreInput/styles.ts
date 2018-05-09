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

import { Platform, StyleSheet } from 'react-native';

export default StyleSheet.create({
  button: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonDisabled: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    opacity: 0.5,
  },
  buttonIcon: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonRow: {
    borderTopColor: '#dedede',
    borderTopWidth: 1,
    flexDirection: 'row',
    marginTop: 12,
    paddingBottom: 0,
  },
  buttonText: {
    color: '#909090',
    fontWeight: 'bold',
    marginVertical: 12,
    textAlign: 'center',
  },
  containerPlayer: {
    alignItems: 'center',
    flex: 1,
    paddingTop: 8,
  },
  containerPlayers: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  containerScore: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 8,
  },
  containerSet: {
    padding: 12,
  },
  iconButton: {
    color: '#909090',
  },
  input: Platform.select({
    android: {
      color: '#fff',
      fontFamily: 'monospace',
      fontSize: 24,
      padding: 6,
      textAlign: 'center',
    },
    ios: {
      color: '#fff',
      fontFamily: 'Courier New',
      fontSize: 24,
      fontWeight: 'bold',
      height: 30,
      margin: 8,
      textAlign: 'center',
    },
  }),
  score: {
    backgroundColor: '#666',
    borderRadius: 3,
    margin: 16,
    marginBottom: 0,
    marginTop: 10,
    width: 60,
  },
  vSeparator: {
    borderLeftColor: '#dedede',
    borderLeftWidth: 1,
    borderRightColor: '#dedede',
    borderRightWidth: 1,
    flex: 1,
  },
});
