import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

class ListItemGroup extends Component {

    render() {
        return (
            <View style={styles.group}>
                { this.props.children }
            </View>
        )
    }
}

ListItemGroup.propTypes = {
    children: React.PropTypes.oneOfType([
        React.PropTypes.array, React.PropTypes.object
    ])
};

const styles = StyleSheet.create({
    group: {
        borderRadius: 4,
        marginHorizontal: 6,
        marginVertical: 6,
        backgroundColor: '#fff'
    }
});

export default ListItemGroup;
