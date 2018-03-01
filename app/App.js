import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import codePush from 'react-native-code-push';
import { Sentry } from 'react-native-sentry';

import AppContainer from './AppContainer';
import LaunchScreen from './components/LaunchScreen';
import store from './config/store';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rehydrated: false,
    };
  }

  componentDidMount() {
    const config = {
      storage: AsyncStorage,
      whitelist: ['app', 'settings', 'auth', 'matches', 'drawer'],
      whitelist: ['app', 'settings', 'auth', 'drawer'],
    };
    persistStore(store, config, () => {
      this.setState({ rehydrated: true });
    });
  }

  render() {
    if (this.state.rehydrated) {
      return (
        <Provider store={store}>
          <AppContainer />
        </Provider>
      );
    } else {
      return <LaunchScreen />;
    }
  }
}

codePush.getUpdateMetadata().then(update => {
  if (update) {
    Sentry.setVersion('codepush:' + update.label);
  }
});

export default codePush(App);
