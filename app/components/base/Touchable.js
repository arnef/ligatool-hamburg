import React, { Component, PropTypes, Children } from 'react'
import { View, TouchableNativeFeedback, TouchableOpacity, Platform } from 'react-native'
import  { ANDROID_VERSION_LOLLIPOP } from '../../consts'


class Touchable extends Component {

    render() {
        if (Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP) {
            const { style, ...rest } = this.props

            return (
                <TouchableNativeFeedback
                    { ...rest }
                    style={null}
                    background={
                        TouchableNativeFeedback.Ripple(
                            this.props.pressColor,
                            this.props.borderless
                        )
                    }>
                    <View style={style}>
                        { this.props.children }
                    </View>
                </TouchableNativeFeedback>
            )
        } else {
            return (
                <TouchableOpacity { ...this.props }>
                    { this.props.children }
                </TouchableOpacity>
            )
        }
        /*if (Platform.OS === 'ios') {

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
        }*/
    }
}

Touchable.defaultProps = {
    pressColor: 'rgba(0, 0, 0, .32)'
}
Touchable.propTypes = {
    borderless: PropTypes.bool,
    pressColor: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.array, PropTypes.object
    ]),
    color: PropTypes.bool,
    onPress: PropTypes.func.isRequired,
    style: PropTypes.oneOfType([ PropTypes.array, PropTypes.number, PropTypes.object ])
}

export default Touchable