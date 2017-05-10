// @flow
import React, { Component } from 'react';
import { View, BackAndroid } from 'react-native';
import { connect } from 'react-redux';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import Loading from './modals/LoadingModal';
import { Root } from './router';
import { backgroundColor } from './components/base/theme';
import NotificationManager from './NotificationManager';

class AppContainer extends Component {

  componentWillMount() {
    NotificationManager.requestPermissions();
    this.notificationListener = NotificationManager.notificationListener();
    this.refreshTokenListener = NotificationManager.refreshTokenListener();


    BackAndroid.addEventListener('hardwareBackPress', () => {
      const oldnav = this.props.nav;
      this.props.dispatch({ type: NavigationActions.BACK });
      const dontClose = this.props.nav !== oldnav;
      if (dontClose) {
        this.props.dispatch({ type: 'UPDATE_DRAWER_ITEM'});
      }
      return dontClose;
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
        <Root
          navigation={addNavigationHelpers({
            dispatch,
            state: nav
          })}
        />
      </View>
    );
  }
}

export default connect(
  state => ({
    auth: state.auth,
    nav: state.nav,
    settings: state.settings
  }),
  dispatch => ({
    dispatch: action => dispatch(action),
  })
)(AppContainer);
