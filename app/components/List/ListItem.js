import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import Touchable from '../Touchable';
import Icon from '../Icon';
import Image from '../Image';
import style from '../Styles/List/ListItem';



class ListItem extends Component {

	render() {
		return (
			<Touchable 
				style={style.item}
				disabled={this.props.disabled} onPress={this.props.onPress ? this.props.onPress.bind(this) : null}>
				{ !!this.props.image && this.renderImage() }
				{ !!this.props.icon && this.renderIcon() }
				<Text style={this.props.disabled ? style.textDisabled : {}}>
					{ this.props.children }
				</Text>
			</Touchable>
		);
	}

	renderImage() {
		return (
			<Image url={this.props.image} style={style.icon} />
		)
	}

	renderIcon() {
		return (
			<Icon style={style.icon} 
						color={this.props.color}
						name={this.props.icon} size={40} />
		)
	}
}

const separator = (props) => (
	<View style={[style.separator, props.icon ? { marginLeft: 72} :{}]} />
);


ListItem.Separator = separator;

export default connect(state => ({
	color: state.settings.color
}))(ListItem);