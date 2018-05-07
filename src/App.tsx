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

import React, { Component } from 'react';
import { Platform, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppContainer from '@app/AppContainer';
import { LaunchScreen } from '@app/components';
import { store, persistor } from '@app/config/store';

interface Props {}
export default class App extends Component<Props> {
  componentDidMount() {
    if (Platform.OS === 'android' && Platform.Version >= 21) {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('rgba(0,0,0,.3)');
    } else if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('dark-content');
    }
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<LaunchScreen />} persistor={persistor}>
          <AppContainer />
        </PersistGate>
      </Provider>
    );
  }
}
