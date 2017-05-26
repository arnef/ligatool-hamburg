// @flow
import React, { Component } from 'react';
import {
  ActionSheetIOS,
  Animated,
  Modal,
  Platform,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  View,
  Dimensions,
} from 'react-native';
import { ListItem, Text } from '../base';

const DEVICE_HEIGHT = Math.round(Dimensions.get('window').height * 0.8);
const DURATION = 250;
class ActionSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      items: [],
      y: new Animated.Value(DEVICE_HEIGHT),
    };
  }

  static actionsheetInstance;

  static show(config, callback) {
    this.actionsheetInstance.showActionSheet(config, callback);
  }

  showActionSheet(config, callback) {
    if (Platform.OS === 'ios') {
      let iosConfig = JSON.parse(JSON.stringify(config));
      iosConfig.options.push('Abbrechen');
      iosConfig.cancelButtonIndex = iosConfig.options.length - 1;
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

  callbackWrapper(cancelIdx, callback) {
    return val => {
      if (val < cancelIdx) {
        callback(val);
      }
    };
  }

  slideIn() {
    Animated.sequence([
      Animated.delay(100),
      Animated.timing(this.state.y, {
        duration: DURATION,
        toValue: 0,
        // useNativeDriver: true,
      }),
    ]).start();
  }

  hide() {
    Animated.timing(this.state.y, {
      duration: DURATION,
      toValue: DEVICE_HEIGHT,
      // useNativeDriver: true,
    }).start(() => this.setState({ modalVisible: false }));
  }

  render() {
    return (
      <Modal
        transparent={true}
        animationType={'fade'}
        onRequestClose={this.hide.bind(this)}
        visible={this.state.modalVisible}
      >
        <TouchableOpacity
          style={style.outside}
          activeOpacity={1}
          onPress={this.hide.bind(this)}
        >
          <Animated.View
            style={[
              style.container,
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
                keyExtractor={(item, index) => `${index}`}
                getItemLayout={(data, index) => ({
                  length: ListItem.ITEM_HEIGHT,
                  offset: ListItem.ITEM_HEIGHT * index,
                  index,
                })}
                renderItem={({ item, index }) => (
                  <ListItem
                    onPress={() => {
                      this.state.callback(index);
                      this.hide();
                    }}
                  >
                    <Text>{`${item}`}</Text>
                  </ListItem>
                )}
              />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const style = StyleSheet.create({
  outside: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    // backgroundColor: '#fff',

    marginTop: Math.round(Dimensions.get('window').height * 0.25),
  },
});

export default ActionSheet;
