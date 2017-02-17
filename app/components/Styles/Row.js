import React, { Component } from 'react';
import { View } from 'react-native';



class Row extends Component {

    render() {
        const style = { flex: 1, flexDirection: 'row' };        
        if (this.props.center) {
            style.alignItems = 'center';
        }
        return (
            <View style={[style, this.props.style]}>
                { this.props.children }
            </View>
        );
    }
}


export default Row;