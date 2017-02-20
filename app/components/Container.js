import React, { Component } from 'react';
import { View, ScrollView, RefreshControl, ListView } from 'react-native';
import { connect } from 'react-redux';
import ErrorFlash from './ErrorFlash';



class Container extends Component {
    

    constructor(props) {
        super(props);
        this.state = {
            data: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        }
    }

    render() {
        const refreshControl = (
            <RefreshControl colors={[this.props.color]}
                refreshing={this.props.refreshing || false}
                onRefresh={this.props.onRefresh} />
        );
        const style = {flex: 1, backgroundColor: '#eee'};
        if (this.props.renderRow) {
        return (
            <View style={style}>
                <ErrorFlash error={this.props.error}/>
                <ListView
                    refreshControl={!!this.props.onRefresh ? refreshControl:null}
                    style={{ flex: 1 }}
                    renderRow={this.props.renderRow}
                    initialListSize={3}
                    pageSize={4}
                    enableEmptySections={true}
                    dataSource={this.state.data.cloneWithRows(this.props.dataSource)}
                />
            </View>
        );
        } else {
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
}

export default connect(state => ({
    color: state.settings.color
}))(Container);