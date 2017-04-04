import React, { Component } from 'react'
import { View, Text, Platform } from 'react-native'
import { connect } from 'react-redux'
import { TabBar } from '../components'
import MatchListView from './MatchListView'
import { Icon, Touchable } from '../components/base'
import { backgroundColor } from '../components/base/theme'
import actions from '../store/actions'
import NavIcon from '../Nav/NavIcon'
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

class Played extends Component {
    static navigationOptions = { title: 'Vergangene' }
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

const Tabs = TabNavigator({
    Live: { screen:  connect(state => ({ matches: state.matches }))(Live) },
    Next: { screen: connect(state => ({ matches: state.matches }))(Next) },
    Played: { screen: connect(state => ({ matches: state.matches }))(Played) }
}, {
    tabBarComponent: NavTabBarTop,
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    lazyLoad: false
})

Tabs.navigationOptions = {
    title: 'Übersicht',
    header: NavDrawerIcon
}

export default Tabs