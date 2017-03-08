import React, { Component } from 'react';
import { View } from 'react-native';

class Column extends Component {

    render() {
        const style = { flex: 1, flexDirection: 'column', borderWidth: 0};
        if (this.props.center) {
            style.alignItems = 'center';
        }
        if (this.props.width) {
            style.flex = this.props.width / 10;
        }
        if (this.props.fluid) {
            style.flex = 0;
        }
        return (
            <View style={[style, this.props.style]}>
                { this.props.children }
            </View>
        );
    }
}

export default Column;