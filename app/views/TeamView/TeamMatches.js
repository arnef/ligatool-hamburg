import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getTeamMatches } from '../../store/actions/teamActions'
import MatchListView from '../MatchListView'



class TeamView extends Component {


    render() {
        const { state } = this.props.navigation
        const matches = this.props.teams.id[`${state.params.team.id}`] ?
            this.props.teams.id[`${state.params.team.id}`].matches : []
        const props = {
            error: this.props.teams.error,
            onRefresh: () => this.props.getTeamMatches(state.params.team.id),
            refreshing: this.props.teams.loading
        }

        return (<MatchListView { ...props} refreshOnMount matches={matches} />)
    }

}

TeamView.propTypes = {
    getTeamMatches: PropTypes.func,
    style: PropTypes.oneOfType([ PropTypes.array, PropTypes.number, PropTypes.object ]),
    team: PropTypes.object,
    teams: PropTypes.object
}

export default connect(
    state => ({
        teams: state.teams
    }),
    dispatch => ({
        getTeamMatches: (id) => dispatch(getTeamMatches(id))
    })
)(TeamView)