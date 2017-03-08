import React, { Component } from 'react';
import { View, Text, Platform } from 'react-native';
import { connect } from 'react-redux';
import Touchable from '../Touchable';
import Icon from '../Icon';
import Image from '../Image';
import style from '../Styles/List/ListItem';



class ListItem extends Component {

	render() {
		return (
			<View>
				<Touchable 
					style={style.item}
					disabled={this.props.disabled} onPress={this.props.onPress ? this.props.onPress.bind(this) : null}>
					{ !!this.props.image && this.renderImage() }
					{ !!this.props.icon && this.renderIcon() }
					<Text style={[{flex: 1}, this.props.disabled ? style.textDisabled : {}]}>
						{ this.props.children }
					</Text>
					{ Platform.OS === 'ios' && this.props.more && (<Icon name='arrow-forward' size={24} />)}
				</Touchable>
				{ !this.props.last && (<View style={[style.separator, (this.props.icon || this.props.image) ? style.seperatorIcon : {}]} />) }
			</View>
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


export default connect(state => ({
	color: state.settings.color
}))(ListItem);