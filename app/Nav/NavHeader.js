// @flow
import React, { Component } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { Header } from 'react-navigation';
import Routes from '../config/routes';
import { colors } from '../config/styles';
import { Icon, Touchable } from '../components';

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

export default {
  cardStyle: { backgroundColor: colors.BACKGROUND },
  navigationOptions: ({ navigation }: any) => {
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
      header: function Header(props: any) {
        return <ConnectHeader {...props} />;
      },
      headerTintColor: '#fff',
      headerBackTitle: null,
      headerPressColorAndroid: white,
      headerRight: showSearch(navigation.state.routeName)
        ? <Touchable
            borderless
            style={{ marginRight: Platform.OS === 'android' ? 16 : 8 }}
            light
            onPress={() => navigation.navigate(Routes.SEARCH)}
          >
            <Icon name="search" color="#fff" size={24} />
          </Touchable>
        : null,
      headerStyle,
    };
  },
};
