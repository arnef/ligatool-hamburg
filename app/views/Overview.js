/* @flow */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import MatchListView from './MatchListView'
import actions from '../store/actions'
import NavDrawerIcon from '../Nav/NavDrawerIcon'
import NavTabBarTop from '../Nav/NavTabBarTop'
import { TabNavigator } from 'react-navigation'
import strings from '../Strings'
import { TAB_MATCHES_TODAY, TAB_MATCHES_NEXT, TAB_MATCHES_PLAYED } from './routes'
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
    title: strings.today
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
    title: strings.next
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
    title: strings.played
}
Played.propTypes = {
    matches: PropTypes.object,
    dispatch: PropTypes.func
}

const Tabs = TabNavigator({
    [TAB_MATCHES_TODAY]: { screen:  connect(state => ({ matches: state.matches }))(Live) },
    [TAB_MATCHES_NEXT]: { screen: connect(state => ({ matches: state.matches }))(Next) },
    [TAB_MATCHES_PLAYED]: { screen: connect(state => ({ matches: state.matches }))(Played) }
}, {
    ...NavTabBarTop,
    lazyLoad: false
})

Tabs.navigationOptions = {
    title: strings.overview,
    header: NavDrawerIcon
}

export default Tabs
