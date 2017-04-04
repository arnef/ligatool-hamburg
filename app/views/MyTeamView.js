import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { TabNavigator } from 'react-navigation'
import MatchListView from './MatchListView'
import NavTabBarTop from '../Nav/NavTabBarTop'
import NavDrawerIcon from '../Nav/NavDrawerIcon'
import { queryTeamMatches } from '../store/actions/teamActions'

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
    title: 'Kommende'
}
Played.navigationOptions = {
    title: 'Vergagene'
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
    tabBarComponent: NavTabBarTop,
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    lazyLoad: false
})

MyTeam.navigationOptions = {
    title: 'Mein Team',
    header: NavDrawerIcon
}

export default MyTeam
