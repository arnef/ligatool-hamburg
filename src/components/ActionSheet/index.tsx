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

import { ListItem, Text } from '@app/components';
import { Strings } from '@app/lib/strings';
import * as React from 'react';
import {
  ActionSheetIOS,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from './styles';

const DEVICE_HEIGHT: number = Math.round(Dimensions.get('window').height * 0.8);
const DURATION: number = 250;

interface IState {
  modalVisible: boolean;
  items: string[];
  y: Animated.Value;
  callback: (selection: number) => void | null;
}

interface IConfig {
  options: string[];
}

export class ActionSheet extends React.Component<null, IState> {
  public static actionsheetInstance: any;

  public static show(config: IConfig, callback: (selection: number) => void) {
    this.actionsheetInstance.showActionSheet(config, callback);
  }

  public state: IState = {
    callback: null,
    items: [],
    modalVisible: false,
    y: new Animated.Value(DEVICE_HEIGHT),
  };

  public showActionSheet(config: IConfig, callback: () => void) {
    if (Platform.OS === 'ios') {
      const iosConfig = {
        ...config,
        cancelButtonIndex: config.options.length,
        options: [...config.options, Strings.CANCEL],
      };
      ActionSheetIOS.showActionSheetWithOptions(
        iosConfig,
        this.callbackWrapper(iosConfig.cancelButtonIndex, callback),
      );
    } else {
      this.setState({
        callback,
        items: config.options,
        modalVisible: true,
      });
      this.slideIn();
    }
  }

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

  private callbackWrapper(
    cancelIdx: number,
    callback: (selection: number) => void,
  ) {
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

  private getItemLayout = (_: any, index: number) => {
    return {
      index,
      length: ListItem.ITEM_HEIGHT,
      offset: ListItem.ITEM_HEIGHT * index,
    };
  };

  private renderItem = ({ item, index }: { item: string; index: number }) => {
    return (
      <ListItem onPress={this.onPress(index)}>
        <Text>{`${item}`}</Text>
      </ListItem>
    );
  };
}
