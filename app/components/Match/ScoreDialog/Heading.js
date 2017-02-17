import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
	View
} from 'react-native';

class Heading extends Component {

  render() {
		const hStyle = {
			padding: 0
		};
		if (this.props.h1) {
			hStyle.padding = 16;
		}
    return (
			<View style={hStyle}>
      	<Text style={style.heading}>{ this.props.children }</Text>
			</View>
    );
  }
}

const style = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

module.exports = Heading;
