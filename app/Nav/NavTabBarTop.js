import React, { Component, PropTypes } from 'react';
import { Platform, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import { TabBarTop } from 'react-navigation';

const white = 'rgba(255, 255, 255, .9)';

class NavTabBarTop extends Component {
  render() {
    return (
      <TabBarTop
        {...this.props}
        activeTintColor="#fff"
        inactiveTintColor={white}
        indicatorStyle={{
          backgroundColor: white,
        }}
        style={{ backgroundColor: this.props.color, elevation: 4 }}
        labelStyle={{
          marginHorizontal: 0,
          marginVertical: 4,
          fontWeight: Platform.OS === 'android' ? '500' : '600',
        }}
      />
    );
  }
}

export default
{
  tabBarComponent: connect(state => ({ color: state.settings.color }))(
    NavTabBarTop,
  ),
  tabBarPosition: 'top',
  swipeEnabled: true,
  animationEnabled: true,
  lazyLoad: true,
  backBehavior: 'none',
  tabBarOptions: {
    scrollEnabled: Dimensions.get('window').width < 321,
  },
};
