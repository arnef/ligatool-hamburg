import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import SetsView from './SetsView'
import PreView from './PreView'
import moment from 'moment'

class MatchView extends Component {

    render() {
        const { id, matches } = this.props
        const match = matches[id]



        if (match.set_points || (match.is_admin && moment(match.datetime).diff(moment(), 'minutes') < 16)) {
            return <SetsView data={match}  />
        } else {
            return <PreView match={match} />
        }
    }

}

MatchView.propTypes = {
    id: PropTypes.number.isRequired,
    matches: PropTypes.object
}

export default connect(state => ({
    matches: state.matches.data
}))(MatchView)