import React, { Component, PropTypes } from 'react';
import { View, StyleSheet } from 'react-native';

class ListItemGroup extends Component {

    render() {
        const { children } = this.props;
        return (
            <View style={styles.group}>
                { children }
            </View>
        )
    }
}

ListItemGroup.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.array, PropTypes.object
    ])
};

const styles = StyleSheet.create({
    group: {
        borderRadius: 4,
        marginHorizontal: 8,
        marginVertical: 6,
        backgroundColor: '#fff'
    }
});

export default ListItemGroup;
