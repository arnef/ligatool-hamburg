import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

class Content extends Component {
  render() {
    return (
      <View style={style.container}>
        {this.props.children}
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    padding: 12,
  },
});

export default Content;
