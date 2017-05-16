// @flow
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

class StaticListHeader extends Component {

  render() {
    return (
      <View style={style.row}>
        { this.props.children }
      </View>
    )
  }
}

const style = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    backgroundColor: '#fff',
    elevation: 2,
    paddingHorizontal: 16
  }
});

export default StaticListHeader;
