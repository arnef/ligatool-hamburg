import React, { Component } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { backgroundColor } from '../theme';

class ListItemGroup extends Component {
  render() {
    const { children } = this.props;

    return (
      <View style={styles.group}>
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  group: {
    backgroundColor: '#fff',
    paddingTop: 12,
    borderTopWidth: 0,
    borderBottomWidth: 1.5,
    borderTopColor: '#fff',
    borderBottomColor: '#ccc'
  }
});

export default ListItemGroup;
