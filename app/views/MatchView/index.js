import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import SetsView from './SetsView'
import PreView from './PreView'
import moment from 'moment'
import NavIcon from '../../Nav/NavIcon'


class MatchView extends Component {

    render() {
        const { navigation, matches } = this.props
        const match = matches[navigation.state.params.id]

        // console.tron.log(navigation)
        // if (match.set_points || (match.is_admin && moment(match.datetime).diff(moment(), 'minutes') < 16)) {

        return <SetsView data={match}  />
        // } else {
        //     return <PreView { ...this.props } />
        // }
    }

}
MatchView.navigationOptions = {
    title: 'Begegnung',
    tabBar: {
        label: 'Mein Team',
        icon: ({ tintColor }) => NavIcon('shirt', tintColor)
    }
}

MatchView.propTypes = {
    id: PropTypes.number,
    matches: PropTypes.object
}

export default connect(state => ({
    matches: state.matches.data
}))(MatchView)