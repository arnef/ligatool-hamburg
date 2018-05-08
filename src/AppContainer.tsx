import * as React from 'react';
import { View, BackHandler, AppState, Platform } from 'react-native';
import { connect } from 'react-redux';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import { Screens } from './scenes';
import { ActionSheet } from './components';
import NotificationManager from './lib/NotificationManager';
import { getColor } from './redux/modules/user';
import TaskDescriptionAndroid from 'react-native-android-taskdescription';
import { ThemeContext, theme } from '@app/theme';
import { hex2hsl } from '@app/helper';

const addListener = createReduxBoundAddListener('root');

interface Props extends StateProps {}
interface AppContainer {
  refreshTokenListener: any;
  notificationListener: any;
}

class AppContainer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.appStateChanged = this.appStateChanged.bind(this);
  }

  componentDidMount() {
    NotificationManager.requestPermissions();
    NotificationManager.getToken();
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
    // this.props.dispatch(LoadingActions.appState(nextState));
  }

  render() {
    console.log(this.props.color);
    const { dispatch, nav } = this.props;
    return (
      <ThemeContext.Provider
        value={{ ...theme, primaryColor: this.props.color }}
      >
        <View style={{ flex: 1, backgroundColor: '#dedede' }}>
          {Platform.OS === 'android' && (
            <TaskDescriptionAndroid backgroundColor={this.props.color} />
          )}
          <ActionSheet
            ref={c => {
              ActionSheet.actionsheetInstance = c;
            }}
          />
          <Screens
            navigation={addNavigationHelpers({
              dispatch,
              state: nav,
              addListener,
            })}
          />
        </View>
      </ThemeContext.Provider>
    );
  }
}

interface StateProps {
  loading: boolean;
  team: any;
  auth: any;
  nav: any;
  color: string;
}

function mapStateToProps(state: any): StateProps {
  return {
    team: state.settings.team,
    auth: state.auth,
    nav: state.nav.navigation,
    color: getColor(state),
  };
}

export default connect(mapStateToProps)(AppContainer);
