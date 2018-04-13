import React, { Component } from 'react';
import { AppRegistry, Platform, StatusBar } from 'react-native';
import App from './app/App';

class androidapp extends Component {
  componentWillMount() {
    if (Platform.OS === 'android' && Platform.Version >= 21) {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('rgba(0,0,0,.3)');
    } else if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('dark-content');
    }
  }

  render() {
    return <App />;
  }
}

AppRegistry.registerComponent('arnefeilligatool', () => androidapp);
