import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import SetsView from './SetsView'
import PreView from './PreView'
import moment from 'moment'

class MatchView extends Component {

    render() {
        const { navigation, matches } = this.props
        const match = matches[navigation.state.params.id]



        if (match.set_points || (match.is_admin && moment(match.datetime).diff(moment(), 'minutes') < 16)) {
            return <SetsView data={match}  />
        } else {
            return <PreView match={match} />
        }
    }

}
MatchView.navigationOptions = {
    title: 'Begegnung'
}

MatchView.propTypes = {
    id: PropTypes.number,
    matches: PropTypes.object
}

export default connect(state => ({
    matches: state.matches.data
}))(MatchView)