import React, { Component } from 'react';
import { AppRegistry, StatusBar } from 'react-native';
import App from './app/App';

import { Sentry } from 'react-native-sentry';

if (!__DEV__) {
  // Sentry.config(
  //   'https://9a666a3137a240fb8b41520b97d47d29:bf46d5a18e794b95abe9b576f4d44096@sentry.io/196572',
  // ).install();
  Sentry.config(
    'https://829de3103eec48a682a028bed1c55170:d809aeb2ce864d8bb45c13f804c61530@sentry.io/296593',
  ).install();
}

class androidapp extends Component {
  componentWillMount() {
    StatusBar.setBarStyle('dark-content');
  }

  render() {
    return <App />;
  }
}

AppRegistry.registerComponent('arnefeilligatool', () => androidapp);
