import React, { Component, PropTypes } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Container, Match } from '../components'


class LiveMatchView extends Component {
    

    componentDidMount() {
        if (!this.props.match.loading) {
            this._fetchLiveMatch()
        }
    }

    _fetchLiveMatch() {
        this.props.getMatch(this.props.id)
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <Match.Header data={this.props.match.data} pushRoute={this.props.pushRoute}  />
                <Container 
                    { ...this.props }
                    error={this.props.match.error}
                    refreshing={this.props.match.loading}
                    onRefresh={this._fetchLiveMatch.bind(this)}>
                    <Match />
                </Container>
            </View>)
    }
}

LiveMatchView.propTypes = {
    getMatch: PropTypes.func,
    id: PropTypes.number,
    match: PropTypes.object,
    pushRoute: PropTypes.func
}

export default connect((state) => ({
    match: state.match,
    settings: state.settings
}))(LiveMatchView)
