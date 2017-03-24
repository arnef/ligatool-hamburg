import React, { Component, PropTypes } from 'react'
import { Modal, View, ActivityIndicator, StyleSheet } from 'react-native'
import { connect } from 'react-redux'

class LoadingModal extends Component {

    render() {
        return (
            <Modal animationType='fade'
                onRequestClose={this.onRequestClose.bind(this)}
                transparent={true}
                visible={this.props.loading}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size='large' color='#fff' />
                </View>
            </Modal>
        )
    }

    onRequestClose() {
        return false
    }
}

const styles = StyleSheet.create({
    loadingContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,.6)',
        flex: 1,
        justifyContent: 'center'
    }
})

LoadingModal.propTypes = {
    loading: PropTypes.bool
}

export default connect(state => ({
    loading: state.loading
}))(LoadingModal)