import React, { Component } from 'react';
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

const white = 'rgba(255, 255, 255, .8)';

class NavHeader extends Component {
  render() {
    console.log(this.props);
    const { style, ...rest } = this.props;
    const headerStyle = [style];
    headerStyle.push({
      backgroundColor: this.props.color,
    });
    if (Platform.OS === 'android' && Platform.Version >= 21) {
      headerStyle.push({
        borderTopWidth: 20,
        borderTopColor: this.props.color,
        height: 56 + 20,
      });
    }

    return <Header {...rest} style={headerStyle} />;
  }
}

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

const ConnectHeader = connect(state => ({ color: state.settings.color }))(
  NavHeader,
);

function showSearch(route) {
  return (
    [
      Routes.SEARCH,
      Routes.SETTINGS,
      Routes.SETTINGS_NOTIFICATIONS,
      'SelectGroup',
      'SelectTeam',
      'LoginView',
      'SelectPlayerView',
    ].indexOf(route) === -1
  );
}

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
  // console.log(notification);
  return null;
}

export default {
  cardStyle: { backgroundColor: colors.BACKGROUND },
  navigationOptions: ({ navigation }) => {
    const headerStyle =
      singleHeader.indexOf(navigation.state.routeName) !== -1
        ? null
        : {
            elevation: 0,
            shadowOpacity: 0,
            shadowRadius: 0,
            shadowOffset: { height: 0 },
            borderBottomWidth: 0,
          };
    return {
      header: function Header(props) {
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
