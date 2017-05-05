import React, { Component, PropTypes } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { CardStack } from 'react-navigation';
import { ANDROID, ANDROID_VERSION_LOLLIPOP } from '../consts';

const white = 'rgba(255, 255, 255, .9)';

class NavHeader extends Component {
  render() {
    const { style, ...rest } = this.props;
    const headerStyle = [style];

    headerStyle.push({
      backgroundColor: this.props.color
    });
    if (
      Platform.OS === ANDROID &&
      Platform.Version >= ANDROID_VERSION_LOLLIPOP
    ) {
      headerStyle.push({
        borderTopWidth: 20,
        borderTopColor: this.props.color,
        height: 56 + 20
      });
    }

    return <CardStack.Header {...rest} style={headerStyle} />;
  }
}

const singleHeader = [
  'Leagues',
  'Settings',
  'SettingsNotification',
  'SelectGroup',
  'SelectTeam',
  'LoginView',
  'SelectPlayerView',
  'LeagueCupMatches'
];

export default {
  headerComponent: connect(state => ({
    color: state.settings.color
  }))(NavHeader),
  navigationOptions: {
    header: navigation => {
      const defaultHeader = {
        backTitle: null,
        tintColor: '#fff',
        pressColor: white
      };

      if (singleHeader.indexOf(navigation.state.routeName) !== -1) {
        return defaultHeader;
      } else {
        return {
          ...defaultHeader,
          style: {
            elevation: 0,
            shadowOpacity: 0,
            shadowRadius: 0,
            shadowOffset: {}
          }
        };
      }
    }
  }
};
