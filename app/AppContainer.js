// @flow
import React, { Component } from 'react';
import { View, BackHandler, AppState } from 'react-native';
import { connect } from 'react-redux';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import Loading from './modals/LoadingModal';
import { Root } from './router';
import { ActionSheet } from './components';
import NotificationManager from './lib/NotificationManager';
import * as LoadingActions from './redux/modules/loading';

import { colors } from './config/styles';

class AppContainer extends Component {
  notificationListener: { remove: Function };
  refreshTokenListener: { remove: Function };
  appStateChanged: Function;

  constructor(props) {
    super(props);
    this.appStateChanged = this.appStateChanged.bind(this);
  }

  componentDidMount() {
    NotificationManager.requestPermissions();
    this.notificationListener = NotificationManager.notificationListener();
    this.refreshTokenListener = NotificationManager.refreshTokenListener();
    AppState.addEventListener('change', this.appStateChanged);
    BackHandler.addEventListener('hardwareBackPress', () => {
      const oldnav = this.props.nav;
      this.props.dispatch({ type: NavigationActions.BACK });
      return this.props.nav !== oldnav;
    });
  }

  componentWillUnmount() {
    if (this.refreshTokenListener) {
      this.refreshTokenListener.remove();
    }
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    AppState.removeEventListener('change', this.appStateChanged);
    BackHandler.removeEventListener('hardwareBackPress');
  }

  appStateChanged(nextState) {
    this.props.dispatch(LoadingActions.appState(nextState));
  }

  render() {
    const { dispatch, nav } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: colors.BACKGROUND }}>
        <Loading />
        <ActionSheet
          ref={c => {
            ActionSheet.actionsheetInstance = c;
          }}
        />
        <Root
          navigation={addNavigationHelpers({
            dispatch,
            state: nav,
          })}
        />
      </View>
    );
  }
}

export default connect(state => ({
  team: state.settings.team,
  auth: state.auth,
  nav: state.nav.navigation,
}))(AppContainer);
