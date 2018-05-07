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
  ActionSheetIOS,
  Animated,
  Modal,
  Platform,
  TouchableOpacity,
  FlatList,
  View,
  Dimensions,
} from 'react-native';
import { Strings } from '@app/lib/strings';
import { ListItem, Text } from '@app/components';

import styles from './styles';

const DEVICE_HEIGHT: number = Math.round(Dimensions.get('window').height * 0.8);
const DURATION: number = 250;

interface Props {}
interface State {
  modalVisible: boolean;
  items: Array<string>;
  y: Animated.Value;
  callback: Function | null;
}

interface config {
  options: Array<string>;
}

export class ActionSheet extends React.Component<Props, State> {
  state: State = {
    modalVisible: false,
    items: [],
    y: new Animated.Value(DEVICE_HEIGHT),
    callback: null,
  };
  static actionsheetInstance: any;

  static show(config: config, callback: Function) {
    this.actionsheetInstance.showActionSheet(config, callback);
  }

  public showActionSheet(config: config, callback: Function) {
    if (Platform.OS === 'ios') {
      let iosConfig = {
        ...config,
        options: [...config.options, Strings.CANCEL],
        cancelButtonIndex: config.options.length,
      };
      ActionSheetIOS.showActionSheetWithOptions(
        iosConfig,
        this.callbackWrapper(iosConfig.cancelButtonIndex, callback),
      );
    } else {
      this.setState({
        items: config.options,
        modalVisible: true,
        callback,
      });
      this.slideIn();
    }
  }

  private callbackWrapper(cancelIdx: number, callback: Function) {
    return (val: number) => {
      if (val < cancelIdx) {
        callback(val);
      }
    };
  }

  private slideIn() {
    Animated.sequence([
      Animated.delay(100),
      Animated.timing(this.state.y, {
        duration: DURATION,
        toValue: 0,
      }),
    ]).start();
  }

  private hide = () => {
    Animated.timing(this.state.y, {
      duration: DURATION,
      toValue: DEVICE_HEIGHT,
    }).start(() => this.setState({ modalVisible: false }));
  };

  private onPress = (index: number) => () => {
    if (this.state.callback) {
      this.state.callback(index);
    }
    this.hide();
  };

  private keyExtrator = (item: string, index: number) => {
    return `${item}-${index}`;
  };

  private getItemLayout = (data: any, index: number) => {
    return {
      length: ListItem.ITEM_HEIGHT,
      offset: ListItem.ITEM_HEIGHT * index,
      index,
    };
  };

  private renderItem = ({ item, index }: { item: string; index: number }) => {
    return (
      <ListItem onPress={this.onPress(index)}>
        <Text>{`${item}`}</Text>
      </ListItem>
    );
  };

  public render() {
    return (
      <Modal
        transparent={true}
        animationType={'fade'}
        onRequestClose={this.hide}
        visible={this.state.modalVisible}
      >
        <TouchableOpacity
          style={styles.outside}
          activeOpacity={1}
          onPress={this.hide}
        >
          <Animated.View
            style={[
              styles.container,
              {
                transform: [{ translateY: this.state.y }],
              },
            ]}
          >
            {/* shadow emulation....elevation not working in modal?! */}
            <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.04)' }} />
            <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.06)' }} />
            <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.08)' }} />
            <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)' }} />
            <View style={{ backgroundColor: '#fff' }}>
              <FlatList
                data={this.state.items}
                keyExtractor={this.keyExtrator}
                getItemLayout={this.getItemLayout}
                renderItem={this.renderItem}
              />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    );
  }
}
