import React, { Component } from 'react';
import { View, Text, Switch } from 'react-native';
import Touchable from '../Touchable';
import style from '../Styles/List/ListItem';


class ListItemSwitch extends Component {
	
	render() {
		return (
			<View>
			<Touchable
				disabled={this.props.disabled}
				style={style.item}
				onPress={() => {
					this.props.onValueChange(!this.props.value);
				}}>
				<Text style={this.props.disabled ? style.textDisabled : {}}>{ this.props.children }</Text>
				<View style={{flex:1}} />
			<Switch 
				disabled={this.props.disabled}
				onValueChange={this.props.onValueChange.bind(this)}
				value={this.props.value} />
			</Touchable>
			{ !this.props.last && (<View style={style.separator} />)}
			</View>
		);
	}
}

export default ListItemSwitch;