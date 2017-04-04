import React, { Component, PropTypes } from 'react'
import { Platform } from 'react-native'
import { connect } from 'react-redux'

import { TabView } from 'react-navigation'

const white = 'rgba(255, 255, 255, .9)'

class NavTabBarTop extends Component {

    render() {
        return <TabView.TabBarTop
            { ...this.props }
            activeTintColor={white}
            inactiveTintColor={white}
            indicatorStyle={{
                backgroundColor: white
            }}
            style={{ backgroundColor: this.props.color, elevation: 4 }}
            labelStyle={{
                marginHorizontal: 0,
                marginVertical: 8,
                fontWeight: Platform.OS === 'android' ? '500' : '600'
            }}
        />
    }
}
NavTabBarTop.propTypes = {
    color: PropTypes.string
}


export default {
    tabBarComponent: connect(state => ({ color: state.settings.color }))(NavTabBarTop),
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    lazyLoad: true,
    backBehavior: 'none'
}