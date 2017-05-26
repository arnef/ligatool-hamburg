import React, { Component } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import Touchable from '../Touchable';
import * as theme from '../theme.js';

class Item extends Component {
  render() {
    const {
      icon,
      multiline,
      maxHeight,
      disabled,
      onPress,
      active,
      last,
      children,
      ...rest
    } = this.props;
    const Container = onPress && !disabled ? Touchable : View;
    const separatorStyle = [styles.separator];
    const itemStyle = [styles.item];

    if (icon) {
      separatorStyle.push({ marginLeft: 64 });
    }

    // if (maxHeight) {
    //   itemStyle.push({ height: maxHeight });
    // }

    if (disabled) {
      itemStyle.push(styles.disabled);
    }
    if (multiline) {
      itemStyle.push({
        paddingVertical: Platform.OS === 'ios' ? 12 : 14,
        height: null,
        alignItems: 'flex-start',
      });
    }

    return (
      <View
        style={
          active
            ? { backgroundColor: theme.backgroundColor }
            : { backgroundColor: '#fff' }
        }
      >
        <Container onPress={onPress} style={itemStyle}>
          {children}
        </Container>
      </View>
    );
  }
}

Item.ITEM_HEIGHT = Platform.OS === 'ios' ? 44 : 48;

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  item: Platform.select({
    android: {
      alignItems: 'center',
      borderWidth: 0,
      flex: 1,
      flexDirection: 'row',
      height: 48,

      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    ios: {
      alignItems: 'center',
      flexDirection: 'row',
      height: 44,
      // maxHeight: 44,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  }),
  separator: Platform.select({
    android: {
      backgroundColor: theme.backgroundColor,
      height: 1,
      marginLeft: 0,
    },
    ios: {
      backgroundColor: theme.backgroundColor,
      height: 1,
      marginLeft: 16,
    },
  }),
  text: {
    color: theme.primaryTextColor,
  },
});

export default Item;
