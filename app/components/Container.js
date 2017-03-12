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
        if (this.props.getRef) {
            this.props.getRef(this);
        }
    }

    render() {
        const refreshControl = (
            <RefreshControl colors={[this.props.color]}
                refreshing={this.props.refreshing || false}
                onRefresh={this.props.onRefresh} />
        );
        const style = { flex: 1, backgroundColor: '#dddfe2' };
        if (this.props.renderRow) {
            return (
                <View style={style}>
                    <ErrorFlash error={this.props.error} />
                    <ListView
                        refreshControl={!!this.props.onRefresh ? refreshControl : null}
                        style={{ flex: 1 }}
                        renderRow={this.props.renderRow}
                        initialListSize={3}
                        pageSize={4}
                        enableEmptySections={true}
                        renderFooter={this.renderFooter.bind(this)}
                        dataSource={this.state.data.cloneWithRows(this.props.dataSource)}
                    />
                </View>
            );
        } else {
            return (
                <View style={style}>
                    <ErrorFlash error={this.props.error} />
                    <ScrollView
                        refreshControl={!!this.props.onRefresh ? refreshControl : null}
                        ref={scrollview => { this.scrollView = scrollview }}
                        style={{ flex: 1 }}>
                        <View>
                        { this.props.children }
                        </View>
                        { this.props.hasTabbar && (<View style={{height: 50}} />)}
                    </ScrollView>
                </View>
            );
        }
    }

    scrollTo(params) {
        if (this.scrollView) {
            setTimeout(() => {
                this.scrollView.scrollTo(params);
            }, 100);
        }
    }

    renderFooter() {
        return (<View style={{height: this.props.hasTabbar ? 50 : 0 }} />);
    }
}

export default connect(state => ({
    color: state.settings.color
}))(Container);