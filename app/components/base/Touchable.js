import React, { Component, PropTypes } from 'react'
import { View, TouchableNativeFeedback, TouchableOpacity, Platform } from 'react-native'

class Touchable extends Component {

    render() {
        const { children, onPress, color, borderless, style } = this.props

        if (Platform.OS === 'ios') {

            return (
                <TouchableOpacity style={{ flex: 1, justifyContent: 'center' }}
                      onPress={ onPress }>
                    <View style={ style }>{ children }</View>
                </TouchableOpacity>
            )
        } else {
            const background = color ?
                TouchableNativeFeedback.Ripple('rgba(256,256,256,.3)', borderless) :
                TouchableNativeFeedback.SelectableBackground()

            return (
                <TouchableNativeFeedback
                    background={background}
                    delayPressIn={50} style={{ flex: 1, justifyContent: 'center' }}
                    onPress={onPress}>
                    <View style={ style }>{ children }</View>
                </TouchableNativeFeedback>
            )
        }
    }
}


Touchable.propTypes = {
    borderless: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.array, PropTypes.object
    ]),
    color: PropTypes.string,
    onPress: PropTypes.func.isRequired,
    style: PropTypes.oneOfType([ PropTypes.array, PropTypes.number, PropTypes.object ])
}

export default Touchable