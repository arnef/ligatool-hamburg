import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Icon from '../Icon';
import style from '../Styles/List/ListItemDrawer';
import Touchable from '../Touchable';

class ListItemDrawer extends Component {

	render() {
		const active = this.props.active ? { backgroundColor: '#eeee'} : null;
		return (
			<Touchable onPress={this.props.onPress.bind(this)}>
				<View style={[style.item, active]}>
					{ this.props.icon && (<Icon name={this.props.icon} size={24} style={style.icon} />) }
					<Text style={style.text}>{ this.props.children }</Text>
				</View>
			</Touchable>
		);
	}
}

ListItemDrawer.Separator = (props) => (<View style={style.separator} />);

export default ListItemDrawer;