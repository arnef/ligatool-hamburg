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

import { getColor } from '@app/redux/modules/user';
import * as React from 'react';
import { Platform } from 'react-native';
import { Header as RNHeader, HeaderProps } from 'react-navigation';
import { connect } from 'react-redux';

const pressColor = 'rgba(255,255,255,.8)';

export const Header = connect((state: any, props: HeaderProps): any => ({
  getScreenDetails: (scene: any) => {
    const details = props.getScreenDetails(scene);
    const border =
      Platform.OS === 'android' && Platform.Version >= 21
        ? {
            borderTopColor: getColor(state),
            borderTopWidth: 20,
            height: 56 + 20,
          }
        : {};

    return {
      ...details,
      options: {
        ...details.options,
        headerStyle: {
          ...border,
          backgroundColor: getColor(state),
        },
      },
    };
  },
}))(RNHeader);

export const headerNavigationOptions: any = {
  cardStyle: {
    backgroundColor: '#dedede',
  },
  navigationOptions: {
    header(props: any) {
      return <Header {...props} />;
    },
    headerBackTitle: null,
    headerPressColorAndroid: pressColor,
    headerTintColor: '#fff',
  },
};
