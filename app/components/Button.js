import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Touchable from './Touchable';
import Icon from './Icon'
import { Text, Row } from './Styles';

class Button extends Component {

	render() {
		let style = {
			margin: 4,
			marginLeft: 0,
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: 12,
			paddingVertical: 10,
			borderRadius: 4
		};
		style.backgroundColor = this.props.primary ? this.props.color : this.props.secondary ? '#fff' : '#ddd';
		
		if (this.props.block) {
			style = { ...style, marginLeft: 4, flex: 1, alignItems: 'center', flexDirection: 'column' }; 
		}
		const fontColor = this.props.primary ? '#fff' : '#666';
		if (this.props.disabled) {
			style.opacity = 0.8;
		}
		
		return (
			<Row style={{flex: 0}}>
				<Touchable
					style={style}
					onPress={!this.props.disabled ? this.props.onPress : null}>
					{ !!this.props.icon && (<Icon name={this.props.icon} color={fontColor} size={20} style={styles.icon} />) }
					<Text bold color={fontColor}>{ this.props.children.toUpperCase() }</Text>
				</Touchable>
			</Row>
		);
	}
}

Button.defaultProps = {
	disabled: false,
	primary: false,
	secondary: false,
	color: '#ddd',
	icon: '',
	block: false,
	onPress: () => {}
};

Button.propTypes = {
	children: React.PropTypes.string.isRequired,
	disabled: React.PropTypes.bool,
	primary: React.PropTypes.bool,
	secondary: React.PropTypes.bool,
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
