import React, { Component } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import Touchable from '../Touchable';
import Icon from '../Icon'
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
					{ !!this.props.icon && (<Icon name={this.props.icon} color={textColor} size={20} style={styles.icon} />) }
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


const styles = StyleSheet.create({
	icon: {
		marginRight: 10
	},
	button: {
		margin: 4,
		marginLeft: 0,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderRadius: 4
	}
});


export default connect(state => ({
	color: state.settings.color
}))(Button);
