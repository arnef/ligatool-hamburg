import React, { Component } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import ErrorFlash from './ErrorFlash';


class Container extends Component {

    render() {
        const refreshControl = (
            <RefreshControl colors={[this.props.color]}
                refreshing={this.props.refreshing || false}
                onRefresh={this.props.onRefresh} />
        );
        const style = {flex: 1, backgroundColor: '#eee'};
        return (
            <View style={style}>
                <ErrorFlash error={this.props.error} />
                <ScrollView 
                    refreshControl={!!this.props.onRefresh ? refreshControl:null}
                    style={{flex: 1}}>
                    { this.props.children }
                </ScrollView>
            </View>
        )
    }
}

export default connect(state => ({
    color: state.settings.color
}))(Container);