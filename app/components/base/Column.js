import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

class Column extends Component {
  render() {
    const { center, width, fluid, style, children } = this.props;
    const columnStyle = [styles.item];

    if (center) {
      columnStyle.push(styles.center);
    }
    if (width) {
      columnStyle.push({ flex: this.props.width });
    }
    if (fluid) {
      columnStyle.push({ flex: 0 });
    }
    if (style) {
      columnStyle.push(style);
    }

    return (
      <View style={columnStyle}>
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
  },
  item: {
    flex: 1,
    flexDirection: 'column',
    borderWidth: 0, //StyleSheet.hairlineWidth,
    borderColor: 'grey',
  },
});

export default Column;
