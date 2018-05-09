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

import { Icon, Touchable } from '@app/components';
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';

interface ICloseIcon {
  action: any;
  navigation: any;
}
class CloseIcon extends React.PureComponent<ICloseIcon> {
  public render() {
    return (
      <Touchable
        pressColor="rgba(255,255,255, .8)"
        style={styles.container}
        onPress={this.onPress}
      >
        <Icon name="close" color="#fff" style={styles.icon} size={iconSize} />
      </Touchable>
    );
  }

  private onPress = () => {
    this.props.navigation.dispatch(this.props.action);
  };
}

export default (navigation: any, action: any) => (
  <CloseIcon navigation={navigation} action={action} />
);

const iconSize = Platform.OS === 'android' ? 24 : 20;
const styles = StyleSheet.create({
  container: {
    marginLeft: Platform.OS === 'android' ? 16 : 12,
  },
  icon: {
    height: iconSize,
    width: iconSize,
  },
});
