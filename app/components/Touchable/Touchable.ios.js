'use strict';

import React, { Component } from 'react';
import {
	TouchableOpacity,
	View
} from 'react-native';

class Touchable extends Component {

	render() {
		const onPress = this.props.onPress || function () {};
		if (this.props.disabled || !this.props.onPress) {
			return (
				<View style={this.props.style}>
					{ this.props.children}
				</View>
			);
		} else {
			return (
				<View style={{backgroundColor: this.props.style.backgroundColor, flex: 1}}>
				<TouchableOpacity 
					style={this.props.style}
					onPress={onPress.bind(this)}
					delayPressIn={0}>
						{ this.props.children}
				</TouchableOpacity>
				</View>
			);
		}
	}
}

Touchable.propTypes = {
	onPress: React.PropTypes.func,
	onLongPress: React.PropTypes.func
};

export default Touchable;
