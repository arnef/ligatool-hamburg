// @flow
import React, { Component } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import { backgroundColor } from './base/theme';
import { darken } from '../Helper';

class StaticListHeader extends Component {
  render() {
    return (
      <View
        style={[style.row, { backgroundColor: darken(this.props.color, 10) }]}
      >
        {this.props.children}
      </View>
    );
  }
}

const style = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,

    elevation: 2,
    paddingHorizontal: 16,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
    zIndex: 1,
  },
});

export default connect(state => ({ color: state.settings.color }))(
  StaticListHeader,
);
