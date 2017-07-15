// @flow
import React, { Component } from 'react';
import { AppRegistry, Platform, StatusBar } from 'react-native';
import App from './app/App';

class androidapp extends Component {
  componentWillMount() {
    if (Platform.Version >= 21) {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('rgba(0,0,0,.3)');
    }
  }

  render() {
    return <App />;
  }
}

AppRegistry.registerComponent('arnefeilligatool', () => androidapp);
