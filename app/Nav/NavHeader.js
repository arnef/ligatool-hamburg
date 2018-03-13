import React from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { Header } from 'react-navigation';
import Routes from '../config/routes';
import { colors } from '../config/styles';
import { Icon, Touchable } from '../components';
import {
  notificationEnabled,
  notificationSubscribedForFixture,
  subscribeFixture,
  unsubscribeFixture,
} from '../redux/modules/settings';
import { getFixture } from '../redux/modules/fixtures';
import { getColor } from '../redux/modules/user';

const white = 'rgba(255, 255, 255, .8)';

const singleHeader = [
  Routes.LEAGUES,
  Routes.SETTINGS,
  Routes.SETTINGS_NOTIFICATIONS,
  Routes.PLAYER,
  Routes.MATCH_DATE,
  'SelectGroup',
  'SelectTeam',
  'LoginView',
  'SelectPlayerView',
];

if (Platform.OS === 'android') {
  singleHeader.push(Routes.MATCH);
}

const ConnectHeader = connect((state, props) => ({
  getScreenDetails: scene => {
    const details = props.getScreenDetails(scene);
    const border =
      Platform.OS === 'android' && Platform.Version >= 21
        ? {
            borderTopWidth: 20,
            borderTopColor: getColor(state),
            height: 56 + 20,
          }
        : {};
    return {
      ...details,
      options: {
        ...details.options,
        headerStyle: {
          ...details.options.headerStyle,
          ...border,
          backgroundColor: getColor(state),
        },
      },
    };
  },
}))(Header);

const ToggleNotification = connect(
  (state, props) => ({
    showIcon:
      notificationEnabled(state) &&
      getFixture(state, props.fixtureId).status !== 'FINISHED' &&
      getFixture(state, props.fixtureId).status !== 'CONFIRMED',
    enabled: notificationSubscribedForFixture(state, props.fixtureId),
  }),
  (dispatch, props) => ({
    subscribe: () => dispatch(subscribeFixture(props.fixtureId)),
    unsubscribe: () => dispatch(unsubscribeFixture(props.fixtureId)),
  }),
)(function ToggleIcon(props) {
  if (props.showIcon) {
    return (
      <Touchable
        borderless
        onPress={props.enabled ? props.unsubscribe : props.subscribe}
        style={{ marginRight: Platform.OS === 'android' ? 16 : 8 }}
        light
      >
        <Icon
          name={props.enabled ? 'notifications' : 'notifications-off'}
          color="#fff"
          size={24}
        />
      </Touchable>
    );
  }
  return null;
});

function showNotificationToggle(state) {
  if (state.routeName === Routes.MATCH) {
    return <ToggleNotification fixtureId={state.params.id} />;
  }
  return null;
}

export default {
  cardStyle: { backgroundColor: colors.BACKGROUND },
  navigationOptions: ({ navigation }) => {
    const headerStyle =
      singleHeader.indexOf(navigation.state.routeName) !== -1
        ? {}
        : {
            elevation: 0,
            shadowOpacity: 0,
            shadowRadius: 0,
            shadowOffset: { height: 0 },
            borderBottomWidth: 0,
          };
    return {
      header: function HeaderNew(props) {
        return <ConnectHeader {...props} />;
      },
      headerTintColor: '#fff',
      headerBackTitle: null,
      headerPressColorAndroid: white,
      headerRight: showNotificationToggle(navigation.state),
      headerStyle,
    };
  },
};
