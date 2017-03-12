import React, { Component } from 'react';
import { View } from 'react-native';

class Column extends Component {

    render() {
        const style = { flex: 1, flexDirection: 'column'};
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

Column.defaultProps = {
    center: false,
    width: 10,
    fluid: false,
    style: {},
    children: []
};

Column.propTypes = {
    center: React.PropTypes.bool,
    width: React.PropTypes.number,
    fluid: React.PropTypes.bool,
    style: React.PropTypes.object,
    children: React.PropTypes.any
};

export default Column;