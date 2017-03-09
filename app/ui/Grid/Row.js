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

Row.defaultProps = {
    center: false,
    style: {},
    children: []
};

Row.propTypes = {
    center: React.PropTypes.bool,
    style: React.PropTypes.oneOfType([
        React.PropTypes.number, React.PropTypes.object, React.PropTypes.array
    ]),
    children: React.PropTypes.oneOfType([
        React.PropTypes.object, React.PropTypes.array
    ])
};

export default Row;