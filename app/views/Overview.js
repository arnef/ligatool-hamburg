import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import MatchListView from './MatchListView'
import actions from '../store/actions'
import NavDrawerIcon from '../Nav/NavDrawerIcon'
import NavTabBarTop from '../Nav/NavTabBarTop'
import { TabNavigator } from 'react-navigation'

class Live extends Component {


    render() {
        const { error, fetched, fetching, today } = this.props.matches
        const props = {
            error,
            fetched,
            refreshing: fetching,
            onRefresh: () => { this.props.dispatch(actions.queryMatches())}
        }

        return (<MatchListView { ...props } matches={today} refreshOnMount />)
    }
}
Live.navigationOptions = {
    title: 'Heute'
}
Live.propTypes = {
    matches: PropTypes.object,
    dispatch: PropTypes.func
}

class Next extends Component {
    render() {
        const { error, fetched, fetching, next } = this.props.matches
        const props = {
            error,
            fetched,
            refreshing: fetching,
            onRefresh: () => { this.props.dispatch(actions.queryMatches())}
        }

        return (<MatchListView { ...props } matches={next} />)
    }
}
Next.navigationOptions = {
    title: 'Kommende'
}
Next.propTypes = {
    matches: PropTypes.object,
    dispatch: PropTypes.func
}
class Played extends Component {

    render() {
        const { error, fetched, fetching, played } = this.props.matches
        const props = {
            error,
            fetched,
            refreshing: fetching,
            onRefresh: () => { this.props.dispatch(actions.queryMatches())}
        }

        return (<MatchListView { ...props } matches={played} />)
    }
}
Played.navigationOptions = {
    title: 'Vergangene'
}
Played.propTypes = {
    matches: PropTypes.object,
    dispatch: PropTypes.func
}

const Tabs = TabNavigator({
    Live: { screen:  connect(state => ({ matches: state.matches }))(Live) },
    Next: { screen: connect(state => ({ matches: state.matches }))(Next) },
    Played: { screen: connect(state => ({ matches: state.matches }))(Played) }
}, {
    ...NavTabBarTop,
    lazyLoad: false
})

Tabs.navigationOptions = {
    title: 'Übersicht',
    header: NavDrawerIcon
}

export default Tabs