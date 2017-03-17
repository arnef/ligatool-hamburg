import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';


class Row extends Component {

    render() {
        const { center, style, fluid } = this.props;

        const rowStyle = [styles.row];
        if (center) {
            rowStyle.push(styles.center);
        }

        if (fluid) {
            rowStyle.push(styles.fluid);
        }
        if (style) {
            rowStyle.push(style);
        }

        return (
            <View style={rowStyle}>
                { this.props.children }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingBottom: 8
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    fluid: {
        paddingHorizontal: 0
    }
});

Row.defaultProps = {
    center: false,
    fluid: false,
    style: {},
    children: []
};

Row.propTypes = {
    center: PropTypes.bool,
    fluid: PropTypes.bool,
    style: PropTypes.oneOfType([ PropTypes.number, PropTypes.object ]),
    children: PropTypes.oneOfType([
        PropTypes.object, PropTypes.array
    ])
};

export default Row;