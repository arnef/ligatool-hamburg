import { theme, ThemeContext } from '@app/theme';
import * as React from 'react';
import { BackHandler, Platform, View } from 'react-native';
import TaskDescriptionAndroid from 'react-native-android-taskdescription';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';

import { ActionSheet } from './components';
import NotificationManager from './lib/NotificationManager';
import { getColor } from './redux/modules/user';
import { Screens } from './scenes';

const addListener = createReduxBoundAddListener('root');

interface IAppContainerProps extends IIStateProps {
  dispatch: (action: any) => void;
}

class AppContainer extends React.Component<IAppContainerProps> {
  private notificationListener: any;
  private refreshTokenListener: any;

  public componentDidMount() {
    NotificationManager.requestPermissions();
    NotificationManager.getToken();
    this.notificationListener = NotificationManager.notificationListener();
    this.refreshTokenListener = NotificationManager.refreshTokenListener();
    BackHandler.addEventListener('hardwareBackPress', this.onHandleBackPress);
  }

  public componentWillUnmount() {
    if (this.refreshTokenListener) {
      this.refreshTokenListener.remove();
    }
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.onHandleBackPress,
    );
  }

  public render() {
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
              addListener,
              dispatch,
              state: nav,
            })}
          />
        </View>
      </ThemeContext.Provider>
    );
  }

  private onHandleBackPress = (): boolean => {
    const oldnav = this.props.nav;
    this.props.dispatch({ type: NavigationActions.BACK });
    return this.props.nav !== oldnav;
  };
}

interface IStateProps {
  team?: any;
  auth?: any;
  nav?: any;
  color?: string;
}

function mapStateToProps(state: any): IStateProps {
  return {
    auth: state.auth,
    color: getColor(state),
    nav: state.nav.navigation,
    team: state.settings.team,
  };
}

export default connect(mapStateToProps, null)(AppContainer);
