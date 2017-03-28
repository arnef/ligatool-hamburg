import React, { Component, PropTypes } from 'react'
import { View, StyleSheet } from 'react-native'

class ListItemGroup extends Component {

    render() {
        const { children } = this.props

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
}

const styles = StyleSheet.create({
    group: {
        backgroundColor: '#fff',
        borderRadius: 4,
        elevation: 1,
        marginHorizontal: 8,
        marginVertical: 6
    }
})

export default ListItemGroup
