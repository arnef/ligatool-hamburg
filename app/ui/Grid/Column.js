import React, { Component } from 'react';
import { View } from 'react-native';

class Column extends Component {

    render() {
        const style = [{ flex: 1, flexDirection: 'column'}];
        if (this.props.center) {
            style.push({ alignItems: 'center' });
        }
        if (this.props.width) {
            style.push({ flex: this.props.width / 10 })
        }
        if (this.props.fluid) {
            style.push({ flex: 0 });
        }
        if (typeof this.props.style === 'array') {
            for (let s of this.props.style) {
                style.push(s);
            }
        } else {
            style.push(this.props.style);
        }
        return (
            <View style={style}>
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