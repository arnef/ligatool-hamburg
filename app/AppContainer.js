// @flow
import React, { Component } from 'react';
import { View, Platform, BackAndroid } from 'react-native';
import { connect } from 'react-redux';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import actions from './store/actions'; // why?
import Loading from './modals/LoadingModal';
import { Root } from './router';
import { ActionSheet } from './components/base';
import { backgroundColor } from './components/base/theme';
import NotificationManager from './NotificationManager';

class AppContainer extends Component {
  componentDidMount() {
    NotificationManager.requestPermissions();
    this.notificationListener = NotificationManager.notificationListener();
    this.refreshTokenListener = NotificationManager.refreshTokenListener();

    BackAndroid.addEventListener('hardwareBackPress', () => {
      const oldnav = this.props.nav;
      this.props.dispatch({ type: NavigationActions.BACK });
      return this.props.nav !== oldnav;;
    });
  }

  componentWillUnmount() {
    if (this.refreshTokenListener) {
      this.refreshTokenListener.remove();
    }
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    BackAndroid.removeEventListener('hardwareBackPress');
  }

  render() {
    const { dispatch, nav } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor }}>
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
  auth: state.auth,
  nav: state.nav.navigation,
}))(AppContainer);
