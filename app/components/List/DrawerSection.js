import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

class SectionHeader extends Component {
  render() {
    return (
      <View style={style.sectionView}>
      <Text style={style.sectionText}>{ this.props.children }</Text>
      </View>
    );
  }
}

const style = StyleSheet.create({
  sectionView: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sectionText: {
    // fontSize: 16,
    fontWeight: 'normal'
  }
});

export default SectionHeader;
