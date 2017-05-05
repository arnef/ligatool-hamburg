import React, { Component } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import Touchable from '../Touchable';
import * as theme from '../theme.js';

class Item extends Component {
  render() {
    const {
      icon,
      maxHeight,
      disabled,
      onPress,
      active,
      last,
      children
    } = this.props;
    const Container = onPress && !disabled ? Touchable : View;
    const separatorStyle = [styles.separator];
    const itemStyle = [styles.item];

    if (icon) {
      separatorStyle.push({ marginLeft: 64 });
    }

    if (maxHeight) {
      itemStyle.push({ height: maxHeight });
    }

    if (disabled) {
      itemStyle.push(styles.disabled);
    }

    return (
      <View style={active ? { backgroundColor: theme.backgroundColor } : {}}>
        <Container onPress={onPress} style={itemStyle}>
          {children}
        </Container>
        {!last && <View style={separatorStyle} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5
  },
  item: Platform.select({
    android: {
      alignItems: 'center',
      borderWidth: 0,
      flex: 1,
      flexDirection: 'row',
      height: 48,
      paddingHorizontal: 16
    },
    ios: {
      alignItems: 'center',
      flexDirection: 'row',
      height: 44,
      paddingHorizontal: 16
    }
  }),
  separator: Platform.select({
    android: {
      backgroundColor: theme.backgroundColor,
      height: 1,
      marginLeft: 0
    },
    ios: {
      backgroundColor: theme.backgroundColor,
      height: 1,
      marginLeft: 16
    }
  }),
  text: {
    color: theme.primaryTextColor
  }
});

export default Item;
