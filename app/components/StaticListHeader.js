// @flow
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { darken } from '../Helper';

class StaticListHeader extends Component {
  render() {
    const headerStyle = [
      style.row,
      { backgroundColor: darken(this.props.color, 5) },
    ];

    if (this.props.style) {
      headerStyle.push(this.props.style);
    }

    return (
      <View style={headerStyle}>
        {this.props.children}
      </View>
    );
  }
}

const style = StyleSheet.create({
  row: {
    elevation: 4,
    paddingHorizontal: 16,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
  },
});

export default connect(state => ({ color: state.settings.color }))(
  StaticListHeader,
);
