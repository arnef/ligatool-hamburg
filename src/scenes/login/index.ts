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

import { StackNavigator } from 'react-navigation';
import { Routes } from '@app/scenes/routes';
import { Welcome } from './scenes/welcome';
import { SelectCompetition } from './scenes/select-competition';
import { Strings } from '@app/lib/strings';
import { SelectTeam } from './scenes/select-team';
import { Login } from './scenes/login';
import { Platform } from 'react-native';
import { getNavigationStateParams } from '@app/redux/modules/navigation';

const headerStyle = {
  backgroundColor: '#fff',
  borderColor: '#fff',
  borderTopWidth: Platform.OS === 'android' && Platform.Version >= 21 ? 20 : 0,
  height: Platform.OS === 'android' && Platform.Version >= 21 ? 76 : 56,
};

const navigationOptions = (title: string) => ({ navigation }: any) => ({
  title,
  gesturesEnabled: false,
  headerStyle,
  headerLeft: (getNavigationStateParams(navigation) || {}).headerLeft,
});

export const LoginScenes = StackNavigator({
  [Routes.welcome]: {
    screen: Welcome,
    navigationOptions: { header: null, gesturesEnabled: false },
  },
  [Routes.selectCompetition]: {
    screen: SelectCompetition,
    navigationOptions: navigationOptions(Strings.SELECT_GROUP),
  },
  [Routes.selectTeam]: {
    screen: SelectTeam,
    navigationOptions: navigationOptions(Strings.SELECT_TEAM),
  },
  [Routes.login]: {
    screen: Login,
    navigationOptions: navigationOptions(Strings.LOGIN),
  },
});
