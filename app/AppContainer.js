import React, { Component } from 'react';
import { View, BackHandler, AppState, Platform } from 'react-native';
import { connect } from 'react-redux';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import Loading from './modals/LoadingModal';
import { Root } from './router';
import { ActionSheet } from './components';
import NotificationManager from './lib/NotificationManager';
import * as LoadingActions from './redux/modules/loading';
import { getColor } from './redux/modules/user';
import { colors } from './config/styles';
import TaskDescriptionAndroid from 'react-native-android-taskdescription';
class AppContainer extends Component {
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
        {Platform.OS === 'android' && (
          <TaskDescriptionAndroid backgroundColor={this.props.color} />
        )}
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
        <Loading loading={this.props.loading} />
      </View>
    );
  }
}

export default connect(state => ({
  loading: state.loading.modal,
  team: state.settings.team,
  auth: state.auth,
  nav: state.nav.navigation,
  color: getColor(state),
}))(AppContainer);
