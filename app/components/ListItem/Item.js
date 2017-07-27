import React, { Component } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import Touchable from '../Touchable';
import { colors } from '../../config/styles';

class Item extends Component {
  render() {
    const { icon, multiline, disabled, onPress, active, children } = this.props;
    const Container = onPress && !disabled ? Touchable : View;
    const separatorStyle = [styles.separator];
    const itemStyle = [styles.item];

    if (icon) {
      separatorStyle.push({ marginLeft: 64 });
    }

    if (disabled) {
      itemStyle.push(styles.disabled);
    }
    if (multiline) {
      itemStyle.push({
        paddingVertical: Platform.OS === 'ios' ? 12 : 14,
        height: null,
        alignItems: 'flex-start',
      });
      if (this.props.center) {
        itemStyle.push({ alignItems: 'center' });
      }
    }

    return (
      <View
        style={
          active
            ? { backgroundColor: colors.BACKGROUND }
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
      backgroundColor: colors.BACKGROUND,
      height: 1,
      marginLeft: 0,
    },
    ios: {
      backgroundColor: colors.BACKGROUND,
      height: 1,
      marginLeft: 16,
    },
  }),
});

export default Item;
