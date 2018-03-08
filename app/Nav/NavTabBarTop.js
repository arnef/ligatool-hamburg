import React, { Component } from 'react';
import { Platform, Dimensions, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { TabBarTop } from 'react-navigation';
import { getColor } from '../redux/modules/user';

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
        style={[
          styles.container,
          {
            backgroundColor: this.props.color,
          },
        ]}
        labelStyle={styles.label}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
    elevation: 4,
  },
  label: {
    marginHorizontal: 0,
    marginVertical: 4,
    fontWeight: Platform.OS === 'android' ? '500' : '600',
  },
});

export default {
  tabBarComponent: connect(state => ({ color: getColor(state) }))(NavTabBarTop),
  tabBarPosition: 'top',
  swipeEnabled: true,
  animationEnabled: true,
  lazy: true,
  backBehavior: 'none',
  tabBarOptions: {
    scrollEnabled: Dimensions.get('window').width < 321,
  },
};
