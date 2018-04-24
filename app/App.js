import React from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import AppContainer from './AppContainer';
import LaunchScreen from './components/LaunchScreen';
import { store, persistor } from './config/store';

export default function App () {
      return (
        <Provider store={store}>
          <PersistGate loading={<LaunchScreen />} persistor={persistor}>
          <AppContainer />
          </PersistGate>
        </Provider>
      );
}
