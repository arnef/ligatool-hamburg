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

import { Button, Text } from '@app/components';
import { Strings } from '@app/lib/strings';
import { hideStart, navigate } from '@app/redux/modules/navigation';
import styles from '@app/scenes/login/styles';
import { Routes } from '@app/scenes/routes';
import * as React from 'react';
import { View } from 'react-native';
import { connect, Dispatch } from 'react-redux';

class WelcomeScene extends React.PureComponent<IIDispatchProps> {
  public render() {
    return (
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          {/* TODO: insert app icon */}
          <Text style={{ padding: 32 }}>{Strings.WELCOME_TEXT}</Text>
          <View style={styles.buttons}>
            <View style={styles.button}>
              <Button onPress={this.props.skip} title={Strings.SKIP} outline />
            </View>
            <View style={styles.button}>
              <Button title={Strings.SET_UP} onPress={this.props.next} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

interface IIDispatchProps {
  skip: () => void;
  next: () => void;
}

function mapDispatchToProps(dispatch: Dispatch<any>): IIDispatchProps {
  return {
    next: () => dispatch(navigate({ routeName: Routes.selectCompetition })),
    skip: () => dispatch(hideStart()),
  };
}

export const Welcome = connect(null, mapDispatchToProps)(WelcomeScene);
