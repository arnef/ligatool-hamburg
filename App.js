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
import DtfbApp from './app/App';
import AppCenter from 'appcenter';
// ignore 
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

export default class App extends Component {
  componentDidMount() {
    if (Platform.OS === 'android' && Platform.Version >= 21) {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('rgba(0,0,0,.3)');
    } else if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('dark-content');
    }
  }

  render() {
    return <DtfbApp />
  }
}