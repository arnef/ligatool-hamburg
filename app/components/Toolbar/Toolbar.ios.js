import React, { Component } from 'react';
import { StyleSheet, Platform, StatusBar, View, Text, Navigator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import store from '../../store';

// StatusBar.setTranslucent(!oldAndroid);
// StatusBar.setBackgroundColor(oldAndroid ? 'rgb(0,0,0)' : 'rgba(0,0,0,.3)');
StatusBar.setBarStyle('light-content', true);

const routeMapper = {
  LeftButton: (route, navigator, index, navState) => {return (<Text></Text>)},
  RightButton: (route, navigator, index, navState) => { return (<Text></Text>)},
  Title: (route, navigator, index, navState) => { return (<Text></Text>)}
};

class Toolbar extends Component {
  

  render() {
    return (<View />);
  }
}

const style = StyleSheet.create({
  container: {
    height: 56,
    top: 0,
    backgroundColor: 'green'
  }
})



export default Toolbar;