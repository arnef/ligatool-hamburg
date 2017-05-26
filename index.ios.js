// @flow
import React, { Component } from 'react';
import { AppRegistry, StatusBar } from 'react-native';
import App from './app/App';

class androidapp extends Component {
  componentWillMount() {
    StatusBar.setBarStyle('light-content');
  }

  render() {
    return <App />;
  }
}

AppRegistry.registerComponent('arnefeilligatool', () => androidapp);
