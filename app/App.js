// @flow
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import AppContainer from './AppContainer';
import LaunchScreen from './components/LaunchScreen';
import store from './config/store';

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
      whitelist: ['app', 'settings', 'auth', 'matches', 'drawer'],
    };
    persistStore(store, config, () => {
      this.setState({ rehydrated: true });
    }).purge(['matches']);
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
