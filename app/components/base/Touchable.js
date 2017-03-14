import React, { Component } from 'react';
import { View, TouchableNativeFeedback, TouchableOpacity, Platform } from 'react-native';
import * as theme from './theme';

class Touchable extends Component {

    render() {
        if (Platform.OS === 'ios') {
            return (
                <TouchableOpacity 
                     style={{ flex: 1, justifyContent: 'center'}} onPress={this.props.onPress}>
                    <View style={this.props.style}>{ this.props.children }</View>
                </TouchableOpacity>
            );
        } else {
            const background = this.props.color ? 
            TouchableNativeFeedback.Ripple('rgba(256,256,256,.5)', this.props.borderless) :
            TouchableNativeFeedback.SelectableBackground();
        return (
                <TouchableNativeFeedback
                    background={background}
                    delayPressIn={50} style={{ flex: 1, justifyContent: 'center'}} onPress={this.props.onPress}>
                    <View style={this.props.style}>{ this.props.children }</View>
                </TouchableNativeFeedback>
            );
        }
    }
}

Touchable.defaultProps = {
    borderless: false
}

Touchable.propTypes = {
    onPress: React.PropTypes.func.isRequired,
    children: React.PropTypes.oneOfType([
        React.PropTypes.array, React.PropTypes.object
    ])
};

export default Touchable;