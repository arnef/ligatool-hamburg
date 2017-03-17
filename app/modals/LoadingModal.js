import React, { Component, PropTypes } from 'react';
import { Modal, View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

class LoadingModal extends Component {

    render() {
        return (
            <Modal animationType='fade' 
                onRequestClose={this.onRequestClose.bind(this)}
                transparent={true}
                visible={this.props.loading}>
                <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,.6)'}}>
                    <View style={{flex: 1}} />
                    <ActivityIndicator size='large' color='#fff' />
                    <View style={{flex: 1}} />
                </View>
            </Modal>
        );
    }

    onRequestClose() {
        return false;
    }
}

LoadingModal.propTypes = {
    loading: PropTypes.bool
};

export default connect(state => ({
    loading: state.loading
}))(LoadingModal);