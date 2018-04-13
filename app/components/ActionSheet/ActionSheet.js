import React, { Component } from 'react';
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
import ListItem from '../ListItem';
import Text from '../Text';
import S from '../../lib/strings';
import styles from './styles';

const DEVICE_HEIGHT = Math.round(Dimensions.get('window').height * 0.8);
const DURATION = 250;

class ActionSheet extends Component {
  state = {
    modalVisible: false,
    items: [],
    y: new Animated.Value(DEVICE_HEIGHT),
    callback: () => null,
  };
  static actionsheetInstance;

  static show(config, callback) {
    this.actionsheetInstance.showActionSheet(config, callback);
  }

  constructor(props) {
    super(props);
    this.hide = this.hide.bind(this);
  }

  showActionSheet(config, callback) {
    if (Platform.OS === 'ios') {
      let iosConfig = {
        ...config,
        options: [...config.options, S.CANCEL],
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
      }),
    ]).start();
  }

  hide() {
    Animated.timing(this.state.y, {
      duration: DURATION,
      toValue: DEVICE_HEIGHT,
    }).start(() => this.setState({ modalVisible: false }));
  }

  render() {
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

export default ActionSheet;
