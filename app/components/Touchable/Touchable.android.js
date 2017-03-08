'use strict';

import React, { Component } from 'react';
import {
	TouchableNativeFeedback,
	View
} from 'react-native';

class Touchable extends Component {

	render() {
		if (this.props.disabled || !this.props.onPress) {
			return (
				<View style={this.props.style}>
					{ this.props.children }
				</View>
			);
		} else {
			return (
				<TouchableNativeFeedback onPress={this.props.onPress}
					useForeground
					delayPressIn={75}>
					<View style={this.props.style}>
						{ this.props.children }
					</View>
				</TouchableNativeFeedback>
			);
		}
	}
}

Touchable.propTypes = {
	onPress: React.PropTypes.func,
	disabled: React.PropTypes.bool,
	children: React.PropTypes.oneOfType([
		React.PropTypes.object, 
		React.PropTypes.array
	])
};

export default Touchable;
