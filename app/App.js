// @flow
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import {
  migrateFromStorage,
  setDefaultSettings,
  checkToken,
} from './store/manifest';
import AppContainer from './AppContainer';
import LaunchScreen from './components/LaunchScreen';
import store from './redux/store';

type State = {
  rehydrated: boolean,
};
type Props = {};

class App extends Component<void, Props, State> {
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      rehydrated: false,
    };
  }

  componentDidMount() {
    const config = {
      storage: AsyncStorage,
      whitelist: ['app', 'settings', 'auth', 'matches'],
    };
    persistStore(store, config, (err: any, localStore: any) => {
      if (localStore.app.version === 1 && !localStore.settings) {
        // first start or old version of app
        migrateFromStorage(store, AsyncStorage).then(
          this.rehydrateDone.bind(this),
        );
      } else {
        this.rehydrateDone();
      }
    });
    // .purge();
  }

  rehydrateDone() {
    setDefaultSettings(store).then(() => {
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
      return <LaunchScreen />;
    }
  }
}

export default App;
