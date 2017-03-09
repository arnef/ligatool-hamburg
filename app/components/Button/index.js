import React, { Component } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import Touchable from '../Touchable';
import { Text, Row } from '../Styles';
import style from './style';

class Button extends Component {

	render() {
		const s = {
			opacity: 1,
			borderColor: this.props.color,
			flex: this.props.block ? 1 : 0
		};
		const textColor = this.props.primary ? '#fff' : this.props.color;
		if (this.props.primary) {
			s.backgroundColor = this.props.color;
			s.borderWidth = 0;
		}
		if (this.props.disabled) {
			s.opacity = this.props.primary ? .8 : .15;
		}
		if (this.props.basic) {
			s.borderWidth = 0;
		}

		return (
			<Row style={{flex: 0}}>
				<Touchable 
					style={[style.button, s]}
					onPress={!this.props.disabled ? this.props.onPress : null}>
					<Text color={textColor} style={[style.buttonText, this.props.block ? { flex: 1} : {}]}>
						{ Platform.OS === 'android' ? this.props.children.toUpperCase() : this.props.children }
					</Text>
				</Touchable>
			</Row>
		);
	}
}

Button.defaultProps = {
	disabled: false,
	primary: false,
	basic: false,
	color: '#ddd',
	style: {},
	icon: '',
	block: false,
	onPress: () => {}
};

Button.propTypes = {
	children: React.PropTypes.string.isRequired,
	disabled: React.PropTypes.bool,
	style: React.PropTypes.object,
	primary: React.PropTypes.bool,
	basic: React.PropTypes.bool,
	color: React.PropTypes.string,
	icon: React.PropTypes.string,
	block: React.PropTypes.bool,
	onPress: React.PropTypes.func
};


export default connect(state => ({
	color: state.settings.color
}))(Button);
