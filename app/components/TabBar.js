import React, { Component, PropTypes } from 'react'
import { StyleSheet, View, Animated, Platform } from 'react-native'
import { connect } from 'react-redux'
import { Touchable, Text } from '../components/base'

class TabBar extends Component {
    render() {
        const containerWidth = this.props.containerWidth
        const numberOfTabs = this.props.tabs.length

        const tabUnderlineStyle = {
            backgroundColor: '#fff',
            bottom: 0,
            height: 3,
            position: 'absolute',
            width: containerWidth / numberOfTabs
        }

        const left = this.props.scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange:[0, containerWidth / numberOfTabs]
        })

        return (
            <View style={[styles.tabs, { backgroundColor: this.props.color }]}>
                { this.props.tabs.map( (name, page) => {
                    const isTabActive = this.props.activeTab === page

                    return this.renderTab(name, page, isTabActive, this.props.goToPage)
                })}
                <Animated.View style={[tabUnderlineStyle, { left }]} />
            </View>
        )
    }

    renderTab(name, page, isActive, onPressHandler) {
        return (
            <Touchable style={styles.tab} key={name} onPress={() => onPressHandler(page)}>
                <Text
                    bold={Platform.OS === 'android'} size={13}
                    color={ isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)'}>{name}</Text>
            </Touchable>
        )
    }
}


const styles = StyleSheet.create({
    tab: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 2
    },
    tabs: {
        borderBottomColor: 'rgba(0, 0, 0, .15)',
        borderBottomWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 0,
        elevation: 4,
        flexDirection: 'row',
        height: 46,
        justifyContent: 'space-around',
        maxHeight: 46
    }
})


TabBar.propTypes = {
    activeTab: PropTypes.number,
    color: PropTypes.string,
    containerWidth: PropTypes.number,
    goToPage: PropTypes.func,
    scrollValue: PropTypes.object,
    tabs: PropTypes.array
}


export default connect(state => ({
    color: state.settings.color
}))(TabBar)