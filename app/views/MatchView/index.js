import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import SetsView from './SetsView'
import PreView from './PreView'
import moment from 'moment'

class MatchView extends Component {

    render() {
        const { match } = this.props
        
        if (match.data.set_points || (match.data.is_admin && moment(match.data.datetime).diff(moment(), 'minutes') < 16)) {
            return <SetsView { ...this.props } />
        } else {
            return <PreView { ...this.props } />
        }
    }

}

MatchView.propTypes = {
    match: PropTypes.object.isRequired
}

export default connect(state => ({
    match: state.match
}))(MatchView)