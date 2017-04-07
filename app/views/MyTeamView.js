import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { TabNavigator } from 'react-navigation'
import MatchListView from './MatchListView'
import NavTabBarTop from '../Nav/NavTabBarTop'
import NavDrawerIcon from '../Nav/NavDrawerIcon'
import { queryTeamMatches } from '../store/actions/teamActions'
import strings from '../Strings'

class Comming extends Component {

    render() {
        const { error, loading, next } = this.props.teamMatches

        const props = {
            error,
            onRefresh: () => { this.props.dispatch(queryTeamMatches())},
            refreshing: loading
        }

        return (
            <MatchListView { ...props } matches={next} refreshOnMount />
        )
    }
}
Comming.propTypes = {
    teamMatches: PropTypes.object,
    dispatch: PropTypes.func
}

class Played extends Component {

    render() {
        const { error, loading, played } = this.props.teamMatches

        const props = {
            error,
            onRefresh: () => { this.props.dispatch(queryTeamMatches())},
            refreshing: loading
        }

        return (
            <MatchListView { ...props } matches={played}  />
        )
    }
}
Played.propTypes = {
    teamMatches: PropTypes.object,
    dispatch: PropTypes.func
}


Comming.navigationOptions = {
    title: strings.next
}
Played.navigationOptions = {
    title: strings.played
}



const MyTeam = TabNavigator({
    Comming: {
        screen: connect(state => ({
            teamMatches: state.teamMatches
        }))(Comming)
    },
    Played: {
        screen: connect(state => ({
            teamMatches: state.teamMatches
        }))(Played)
    }
}, {
    ...NavTabBarTop,
    lazyLoad: false
})

MyTeam.navigationOptions = {
    title: strings.my_team,
    header: NavDrawerIcon
}

export default MyTeam
