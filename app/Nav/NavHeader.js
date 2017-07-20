// @flow
import React, { Component } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { Header } from 'react-navigation';
import Routes from '../config/routes';
import { backgroundColor } from '../components/base/theme';

const white = 'rgba(255, 255, 255, .8)';

class NavHeader extends Component {
  render() {
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
  'SelectGroup',
  'SelectTeam',
  'LoginView',
  'SelectPlayerView',
];

const ConnectHeader = connect(state => ({ color: state.settings.color }))(
  NavHeader,
);

export default {
  cardStyle: { backgroundColor },
  navigationOptions: ({ navigation }: any) => {
    const headerStyle =
      singleHeader.indexOf(navigation.state.routeName) !== -1
        ? null
        : { elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 };

    return {
      header: (props: any) => <ConnectHeader {...props} />,
      headerTintColor: '#fff',
      headerBackTitle: null,
      headerPressColorAndroid: white,
      headerStyle,
    };
  },
};
