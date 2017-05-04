import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Platform } from 'react-native';

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

ListItemGroup.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
};

const styles = StyleSheet.create({
  group: Platform.select({
    android: {
      backgroundColor: '#fff',
      borderRadius: 4,
      elevation: 1,
      marginHorizontal: 8,
      marginVertical: 6
    },
    ios: {
      backgroundColor: '#fff',
      marginHorizontal: 0,
      marginVertical: 6,
      shadowOffset: { height: 0, width: 0 },
      shadowOpacity: 0.25
    }
  })
});

export default ListItemGroup;
