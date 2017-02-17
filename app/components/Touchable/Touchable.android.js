'use strict';

import React, { Component } from 'react';
import {
	TouchableNativeFeedback,
	View
} from 'react-native';

class Touchable extends Component {

	render() {
		const onPress = this.props.onPress || function () {};
		const longPress = this.props.onLongPress || function () {};
		if (this.props.disabled || (!this.props.onPress && !this.props.onLongPress)) {
			return (
				<View style={this.props.style}>
					{ this.props.children }
				</View>
			);
		} else {
			return (
				<TouchableNativeFeedback onPress={onPress.bind(this)}
					delayPressIn={75}
					onLongPress={longPress.bind(this)}>
					<View style={this.props.style}>
						{ this.props.children }
					</View>
				</TouchableNativeFeedback>
			);
		}
	}
}

export default Touchable;
