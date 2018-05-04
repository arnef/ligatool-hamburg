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
import { Platform, Dimensions, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {
  TabBarTop as RNTabBarTop,
  TabBarTopProps,
  TabNavigatorConfig,
} from 'react-navigation';
import { getColor } from 'src/redux/modules/user';

const white = '#fff';
const white9 = 'rgba(255,255,255,.8 )';

interface Props extends TabBarTopProps, StateProps {}

export class TabBarTop extends React.PureComponent<Props> {
  public render() {
    return (
      <RNTabBarTop
        {...this.props}
        activeTintColor={white}
        inactiveTintColor={white9}
        indicatorStyle={{ backgroundColor: white9 }}
        style={[styles.container, { backgroundColor: this.props.color }]}
        labelStyle={styles.label}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: Platform.select({
    ios: {
      shadowColor: 'black',
      shadowOpacity: 0.1,
      shadowRadius: StyleSheet.hairlineWidth,
    },
    android: {
      elevation: 4,
    },
  }),
  label: {
    marginHorizontal: 0,
    marginVertical: 4,
    fontWeight: Platform.OS === 'android' ? '500' : '600',
  },
});

interface StateProps {
  color: string;
}

function mapStateToProps(state: any): StateProps {
  return { color: getColor(state) };
}

export const topTabBarNavigationOptions: TabNavigatorConfig = {
  tabBarComponent: connect(mapStateToProps)(TabBarTop),
  tabBarPosition: 'top',
  swipeEnabled: true,
  animationEnabled: true,
  lazy: true,
  backBehavior: 'none',
  tabBarOptions: {
    scrollEnabled: Dimensions.get('window').width < 321,
  },
};
