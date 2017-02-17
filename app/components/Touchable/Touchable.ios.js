'use strict';

import React, { Component } from 'react';
import {
	TouchableOpacity,
	View
} from 'react-native';

class Touchable extends Component {

	render() {
		const onPress = this.props.onPress || function () {};
		const longPress = this.props.onLongPress || function () {};
		if (this.props.disabled || (!this.props.onPress && !this.props.onLongPress)) {
			return (
				<View style={this.props.style}>
					{ this.props.children}
				</View>
			);
		} else {
			return (
				<TouchableOpacity onPress={onPress.bind(this)}
					delayPressIn={0} style={this.props.style}
					onLongPress={longPress.bind(this)}>
						{ this.props.children}
				</TouchableOpacity>
			);
		}
	}
}

Touchable.propTypes = {
	onPress: React.PropTypes.func,
	onLongPress: React.PropTypes.func
};

export default Touchable;
