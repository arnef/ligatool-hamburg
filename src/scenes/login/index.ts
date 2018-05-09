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

import { Strings } from '@app/lib/strings';
import { getNavigationStateParams } from '@app/redux/modules/navigation';
import { Routes } from '@app/scenes/routes';
import { Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';

import { Login } from './scenes/login';
import { SelectCompetition } from './scenes/select-competition';
import { SelectTeam } from './scenes/select-team';
import { Welcome } from './scenes/welcome';

const headerStyle = {
  backgroundColor: '#fff',
  borderColor: '#fff',
  borderTopWidth: Platform.OS === 'android' && Platform.Version >= 21 ? 20 : 0,
  height: Platform.OS === 'android' && Platform.Version >= 21 ? 76 : 56,
};

const navigationOptions = (title: string) => ({ navigation }: any) => ({
  gesturesEnabled: false,
  headerLeft: (getNavigationStateParams(navigation) || {}).headerLeft,
  headerStyle,
  title,
});

export const LoginScenes = StackNavigator({
  [Routes.welcome]: {
    navigationOptions: { header: null, gesturesEnabled: false },
    screen: Welcome,
  },
  [Routes.selectCompetition]: {
    navigationOptions: navigationOptions(Strings.SELECT_GROUP),
    screen: SelectCompetition,
  },
  [Routes.selectTeam]: {
    navigationOptions: navigationOptions(Strings.SELECT_TEAM),
    screen: SelectTeam,
  },
  [Routes.login]: {
    navigationOptions: navigationOptions(Strings.LOGIN),
    screen: Login,
  },
});
