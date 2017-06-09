// @flow
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { backgroundColor } from './theme';

class Separator extends Component {
  render() {
    const separatorStyle = [style.separator];
    let marginLeft = 16;

    if (this.props.image) {
      marginLeft += 48;
    }

    if (this.props.table) {
      marginLeft += 24;
    }

    if (this.props.full) {
      marginLeft = 0;
    }
    if (this.props.group) {
      marginLeft = 0;
      separatorStyle.push({ height: 12 });
    }
    separatorStyle.push({ marginLeft });

    return (
      <View style={style.container}>
        <View style={separatorStyle} />
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor,
  },
});

export default Separator;
