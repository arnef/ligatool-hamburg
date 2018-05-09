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
import { Dimensions, Platform, StyleSheet, ViewStyle } from 'react-native';
import {
  TabBarTop as RNTabBarTop,
  TabBarTopProps,
  TabNavigatorConfig,
} from 'react-navigation';
import { connect } from 'react-redux';

const white = '#fff';
const white9 = 'rgba(255,255,255,.8 )';

interface IProps extends TabBarTopProps, IStateProps {}

export class TabBarTop extends React.PureComponent<IProps> {
  public render() {
    const style: ViewStyle[] = [
      styles.container,
      { backgroundColor: this.props.color },
    ];
    return (
      <RNTabBarTop
        {...this.props}
        activeTintColor={white}
        inactiveTintColor={white9}
        indicatorStyle={{ backgroundColor: white9 }}
        style={style} // TODO: check react-navigation
        labelStyle={styles.label}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: Platform.select({
    android: {
      elevation: 4,
    },
    ios: {
      shadowColor: 'black',
      shadowOpacity: 0.1,
      shadowRadius: StyleSheet.hairlineWidth,
    },
  }),
  label: {
    fontWeight: Platform.OS === 'android' ? '500' : '600',
    marginHorizontal: 0,
    marginVertical: 4,
  },
});

interface IStateProps {
  color: string;
}

function mapStateToProps(state: any): IStateProps {
  return { color: getColor(state) };
}

export const topTabBarNavigationOptions: TabNavigatorConfig = {
  animationEnabled: true,
  backBehavior: 'none',
  lazy: true,
  swipeEnabled: true,
  tabBarComponent: connect(mapStateToProps)(TabBarTop),
  tabBarOptions: {
    scrollEnabled: Dimensions.get('window').width < 321,
  },
  tabBarPosition: 'top',
};
