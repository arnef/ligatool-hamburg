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
import * as React from 'react';
import { StackNavigator } from 'react-navigation';
import { Strings } from 'src/lib/strings';

import { Routes } from './routes';
import { AppScenes } from './app';
import { LoginScenes } from './login';
import { SelectPlayerScenes } from './select-player';

export const Screens = StackNavigator(
  {
    [Routes.app]: { screen: AppScenes },
    [Routes.welcome]: { screen: LoginScenes },
    [Routes.selectPlayer]: { screen: SelectPlayerScenes },
  },
  {
    headerMode: 'none',
    mode: 'modal',
    initialRouteName: Routes.app,
  },
);
