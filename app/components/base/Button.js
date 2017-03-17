import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Touchable, Text } from '../base';
import { connect } from 'react-redux';

class Button extends Component {

	render() {
		const { style, onPress, disabled, color, loading } = this.props;
		const buttonStyle = [styles.button];
		buttonStyle.push({ backgroundColor: color});
		if (style) {
			buttonStyle.push(style);
		}
		if (disabled) {
			buttonStyle.push(styles.disabled);
			
		}
		const Touch = disabled || loading ? View : Touchable;
		const android = Platform.OS === 'android';
		return (
			<Touch onPress={onPress} style={buttonStyle} color>
				<Text color='#fff' bold={android} upperCase={android}>{ this.props.children }</Text>
			</Touch>
		);
	}
}

const styles = StyleSheet.create({
	button: {
		flex: 1,
		minHeight: Platform.select({
			ios: 26,
			android: 20
		}),
		marginVertical: 8,
		paddingVertical: 8,
		borderRadius: 4,
		paddingHorizontal: 16,
		alignItems: 'center',
		justifyContent: 'center'
	},
	disabled: {
		opacity: 0.5
	}
})

Button.propTypes = {
	style: PropTypes.oneOfType([ PropTypes.number, PropTypes.object ]),
	onPress: PropTypes.func,
	disabled: PropTypes.bool,
	loading: PropTypes.bool,
	color: PropTypes.string,
	children: PropTypes.string
};

export default connect(state => ({
	color: state.settings.color
}))(Button);
