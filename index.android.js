// @flow
import React, { Component } from 'react';
import { AppRegistry, Platform, StatusBar } from 'react-native';
import { ANDROID_VERSION_LOLLIPOP } from './app/consts';
import App from './app/App';

class androidapp extends Component {
  componentWillMount() {
    if (Platform.Version >= ANDROID_VERSION_LOLLIPOP) {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('rgba(0,0,0,.3)');
    }
  }

  render() {
    return <App />;
  }
}

AppRegistry.registerComponent('arnefeilligatool', () => androidapp);
