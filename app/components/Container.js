import React, { Component, PropTypes } from 'react'
import { View, ScrollView, RefreshControl, ListView , Platform } from 'react-native'
import { connect } from 'react-redux'
import ErrorFlash from './ErrorFlash'
import * as theme from './base/theme'


class Container extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        }
        if (this.props.getRef) {
            this.props.getRef(this)
        }
    }

    render() {
        const refreshControl = (
            <RefreshControl colors={[this.props.color]}
                refreshing={this.props.refreshing || false}
                onRefresh={this.props.onRefresh} />
        )
        const style = { backgroundColor: theme.backgroundColor, flex: 1 }

        if (this.props.renderRow) {
            return (
                <View style={style}>
                    <ErrorFlash error={this.props.error} />
                    <ListView
                        keyboardShouldPersistTaps='handled'
                        refreshControl={!!this.props.onRefresh ? refreshControl : null}
                        style={{ flex: 1 }}
                        renderRow={this.props.renderRow}
                        initialListSize={3}
                        pageSize={4}
                        enableEmptySections={true}
                                                automaticallyAdjustContentInsets={true}

                        renderFooter={this.renderFooter.bind(this)}
                        renderHeader={this.renderHeader.bind(this)}
                        dataSource={this.state.data.cloneWithRows(this.props.dataSource)}
                    />
                </View>
            )
        } else {
            return (
                <View style={style}>
                    <ErrorFlash error={this.props.error} />
                    <ScrollView
                        keyboardShouldPersistTaps='handled'
                        automaticallyAdjustContentInsets={false}
                        onScroll={this.props.onScroll}
                        scrollEventThrottle={200}
                        refreshControl={!!this.props.onRefresh ? refreshControl : null}
                        ref={scrollview => { this.scrollView = scrollview }}
                        style={{ flex: 1 }}>
                        <View style={{ paddingVertical: 4 }}>
                        { this.props.children }
                        </View>
                    </ScrollView>
                </View>
            )
        }
    }

    scrollTo(params) {
        if (this.scrollView) {
            setTimeout(() => {
                this.scrollView.scrollTo(params)
            }, 100)
        }
    }

    renderFooter() {
        return (<View style={{ height: 4 }} />)
    }

    renderHeader() {
        return (<View style={{ height: 4 }} />)
    }
}

Container.propTypes = {
    children: PropTypes.any,
    color: PropTypes.string,
    dataSource: PropTypes.array,
    error: PropTypes.string,
    getRef: PropTypes.func,
    onRefresh: PropTypes.func,
    onScroll: PropTypes.func,
    refreshing: PropTypes.bool,
    renderRow: PropTypes.func
}

export default connect(state => ({
    color: state.settings.color
}))(Container)