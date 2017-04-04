import React, { Component, PropTypes } from 'react'
import { Platform } from 'react-native'
import { connect } from 'react-redux'
import { CardStack } from 'react-navigation'
import { ANDROID, ANDROID_VERSION_LOLLIPOP } from '../consts'


class NavHeader extends Component {

    render() {
        const { style, ...rest } = this.props
        const headerStyle = [ style ]

        headerStyle.push({
            backgroundColor: this.props.color
        })
        if (Platform.OS === ANDROID && Platform.Version >= ANDROID_VERSION_LOLLIPOP) {
            headerStyle.push({
                borderTopWidth: 20,
                borderTopColor: this.props.color,
                height: 56 + 20
            })
        }

        return (<CardStack.Header
            { ...rest }
            style={ headerStyle } />
        )
    }
}

NavHeader.propTypes = {
    color: PropTypes.string,
    style: PropTypes.oneOfType([ PropTypes.object, PropTypes.number ])
}

const singleHeader = ['Leagues', 'Settings', 'SettingsNotification', 'SelectGroup', 'SelectTeam', 'LoginView', 'SelectPlayerView']

export default {
    headerComponent: connect(
        state => ({
            color: state.settings.color
        })
    )(NavHeader),
    navigationOptions: {
        header: (navigation) => {

            const defaultHeader = { backTitle: null, tintColor: '#fff' }

            if (singleHeader.indexOf(navigation.state.routeName) === -1) {
                return {
                    ...defaultHeader,
                    style : {
                        elevation: 0,
                        shadowOpacity: 0,
                        shadowRadius: 0,
                        shadowOffset: {}
                    }
                }
            } else {
                return defaultHeader
            }
        }
    }
}
