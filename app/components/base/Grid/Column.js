import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';

class Column extends Component {

    render() {
        const { center, width, fluid, style, children } = this.props;

        const columnStyle = [styles.item];
        if (center) {
            columnStyle.push(styles.center);
        }
        if (width) {
            columnStyle.push({ flex: this.props.width / 10 })
        }
        if (fluid) {
            columnStyle.push({ flex: 0 });
        }
        if (style) {
            columnStyle.push(style);
        }
        return (
            <View style={columnStyle}>
                { children }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        flexDirection: 'column'
    },
    center: {
        alignItems: 'center'
    }
})

Column.defaultProps = {
    center: false,
    width: 10,
    fluid: false,
    style: {},
    children: []
};

Column.propTypes = {
    center: PropTypes.bool,
    width: PropTypes.number,
    fluid: PropTypes.bool,
    style: PropTypes.oneOfType([
        PropTypes.object, PropTypes.number
    ]),
    children: PropTypes.any
};

export default Column;