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
import {
  Modal,
  Platform,
  KeyboardAvoidingView,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { default as ScoreInput } from './ScoreInput';
import { Card } from '..';

interface Props {
  data: any;
  modus: any;
  color: string;
  loading: boolean;
  getSet: Function;
  onCancel: () => void;
  onSave: Function;
}

export default class ScoreInputDialog extends React.PureComponent<Props> {
  public render() {
    const Container = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
    const props = Platform.OS === 'ios' ? { behavior: 'height' } : {};
    return (
      <Modal
        animationType="fade"
        onRequestClose={this.props.onCancel}
        transparent={true}
        visible={!!this.props.data || this.props.loading}
      >
        <Container {...props} style={styles.container}>
          {this.props.loading && (
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Card style={{ flex: 0, padding: 20 }}>
                <ActivityIndicator size="large" color={this.props.color} />
              </Card>
            </View>
          )}
          {!!this.props.data &&
            !this.props.loading && (
              <Card style={{ flex: 0 }}>
                <ScoreInput
                  modus={this.props.modus}
                  getSet={this.props.getSet}
                  onCancel={this.props.onCancel}
                  onSave={this.props.onSave}
                  data={this.props.data}
                />
              </Card>
            )}
        </Container>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,.5)',
  },
});
