import React, { Component, PropTypes } from 'react'
import { Platform } from 'react-native'
import { connect } from 'react-redux'

import { TabView } from 'react-navigation'

class NavTabBarTop extends Component {

    render() {
        return <TabView.TabBarTop
            { ...this.props }
            activeTintColor='#fff'
            inactiveTintColor='rgba(255,255,255,.8)'
            indicatorStyle={{
                backgroundColor: '#fff'
            }}
            style={{ backgroundColor: this.props.color }}
            labelStyle={{
                marginHorizontal: 0,
                marginVertical: 8,
                fontWeight: Platform.OS === 'android' ? '700' : 'normal'

            }}
        />
    }
}
NavTabBarTop.propTypes = {
    color: PropTypes.string
}

export default connect(
    state => ({ color: state.settings.color })
)(NavTabBarTop)