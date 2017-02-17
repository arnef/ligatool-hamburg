import React, { Component } from 'react';
import { Text as RNText } from 'react-native';

class Text extends Component {

    render() { 
         const style = {};
        if (this.props.center) {
            style.textAlign = 'center';
        }
        if (this.props.bold) {
            style.fontWeight = 'bold';
        }
        if (this.props.color) {
            style.color = this.props.color;
        }
        if (this.props.size) {
            style.fontSize = this.props.size;
        }
        return (
            <RNText style={[style, this.props.style]}>{this.props.children}</RNText>
        );
    }
}

export default Text;