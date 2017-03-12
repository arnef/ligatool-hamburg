import React, { Component } from 'react';
import { View, TouchableNativeFeedback, TouchableOpacity, Platform } from 'react-native';


class Touchable extends Component {

    render() {
        const Touch = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

        return (
            <Touch onPress={this.props.onPress}>
                <View>
                    { this.props.children }
                </View>
            </Touch>
        );
    }
}

Touchable.propTypes = {
    onPress: React.PropTypes.func.isRequired,
    children: React.PropTypes.oneOfType([
        React.PropTypes.array, React.PropTypes.object
    ])
}

export default Touchable;