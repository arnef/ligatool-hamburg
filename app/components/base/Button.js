import React, { Component } from 'react';
import { Button as RNButton } from 'react-native';
import { connect } from 'react-redux';

class Button extends Component {

	render() {
		return (
			<RNButton 
				onPress={this.props.onPress}
				disabled={this.props.disabled}
				color={this.props.color} title={this.props.children} />
		);
	}
}

Button.propTypes = {
	onPress: React.PropTypes.func,
	disabled: React.PropTypes.bool,
	color: React.PropTypes.string,
	children: React.PropTypes.string
};

export default connect(state => ({
	color: state.settings.color
}))(Button);
