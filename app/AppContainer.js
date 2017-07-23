// @flow
import React, { Component } from 'react';
import { View, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import Loading from './modals/LoadingModal';
import { Root } from './router';
import { ActionSheet } from './components';
import NotificationManager from './lib/NotificationManager';
import type { Listener } from './lib/NotificationManager';
import Route from './config/routes';

import { colors } from './config/styles';

class AppContainer extends Component {
  notificationListener: Listener;
  refreshTokenListener: Listener;

  componentDidMount() {
    NotificationManager.requestPermissions();
    this.notificationListener = NotificationManager.notificationListener();
    this.refreshTokenListener = NotificationManager.refreshTokenListener();

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
    BackHandler.removeEventListener('hardwareBackPress');
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
            dispatch: action => {
              if (action.routeName === Route.MY_TEAM && !this.props.team) {
                dispatch({
                  ...action,
                  routeName: Route.MODAL_LOGIN,
                  params: { next: Route.MY_TEAM },
                });
              } else {
                dispatch(action);
              }
            },
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
