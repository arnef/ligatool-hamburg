import React, { Component, PropTypes } from 'react'
import { Modal, View, ActivityIndicator, StyleSheet, Platform } from 'react-native'
import { connect } from 'react-redux'

class LoadingModal extends Component {

    render() {
        const { loading } = this.props

        return (
            <Modal animationType='fade'
                onRequestClose={this.onRequestClose.bind(this)}
                transparent={true}
                visible={loading.blocking}>
                <View style={styles.loadingContainer}>
                    <View style={styles.loading}>
                        <ActivityIndicator size='large' color='#fff' />
                    </View>
                </View>
            </Modal>
        )
    }

    onRequestClose() {
        return false
    }
}

const styles = StyleSheet.create({
    loading: Platform.select({
        android: {},
        ios: {
            alignItems: 'center',
            backgroundColor: 'rgba(68, 68, 68, .7)',
            borderRadius: 10,
            height: 80,
            justifyContent: 'center',
            width: 80
        }
    }),
    loadingContainer: {
        alignItems: 'center',
        backgroundColor: Platform.OS === 'ios' ? 'rgba(0,0,0,.3)' : 'rgba(0, 0, 0, .6)',
        flex: 1,
        justifyContent: 'center'
    }
});


export default connect(state => ({
    loading: state.loading
}))(LoadingModal)
