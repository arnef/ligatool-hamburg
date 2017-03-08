import React, { Component } from 'react';
import { Text as RNText } from 'react-native';

class Text extends Component {

    render() { 
         const style = {
             fontSize: this.props.size
         };
        if (this.props.center) {
            style.textAlign = 'center';
        }
        if (this.props.bold) {
            style.fontWeight = 'bold';
        }
        if (this.props.color) {
            style.color = this.props.color;
        }
        return (
            <RNText numberOfLines={2} ellipsizeMode='tail' { ...this.props} style={[style, this.props.style]}>{this.props.children}</RNText>
        );
    }
}

Text.defaultProps = {
    size: 14
};

Text.propTypes = {
    size: React.PropTypes.number
};

export default Text;