// @flow
import React, { Component } from 'react';
import { AsyncStorage, Alert } from 'react-native';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { migrateFromStorage, setDefaultSettings, checkToken } from './store/manifest';
import AppContainer from './AppContainer';
import LaunchScreen from './components/LaunchScreen';
import * as actions from './store/actions'
import store from './store';


type State = {
  rehydrated: boolean,
  message: string
};
type Props = {};


class App extends Component<void, Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      rehydrated: false
    };
  }

  componentWillMount() {
    const config = { storage: AsyncStorage, blacklist: ['nav', 'drawer'] }
    persistStore(store, config, (err: any, localStore: any) => {
      if (localStore.app.version === 1 && !localStore.settings) {
        // first start or old version of app
        migrateFromStorage(store, AsyncStorage).then(
          this.rehydrateDone.bind(this)
        );
      } else {
        this.rehydrateDone();
      }
    })
    // .purge();
  }

  rehydrateDone() {
    setDefaultSettings(store).then(resp => {
      checkToken(store).then(() => {
        this.setState({ rehydrated: true });
      });
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
      return (
        <LaunchScreen />
      );
    }
  }
}

export default App;
