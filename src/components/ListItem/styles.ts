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
  disabled: {
    opacity: 0.5,
  },
  group: {
    backgroundColor: '#fff',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1.5,
    borderTopColor: '#fff',
    borderTopWidth: 0,
    paddingTop: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 12,
  },
  headerText: {
    marginBottom: 0,
    marginHorizontal: 16,
    marginTop: 0,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    ...Platform.select({
      android: {
        flex: -1,
        flexGrow: 1,
        height: 48,
        minHeight: 48,
        paddingVertical: 14,
      },
      ios: {
        height: 44,
        paddingVertical: 12,
      },
    }),
  },
  separator: {
    backgroundColor: '#dedede',
    height: 1,
    marginLeft: Platform.select({
      android: 0,
      ios: 16,
    }),
  },
});
