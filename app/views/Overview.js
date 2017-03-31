import React, { Component } from 'react'
import { View } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { connect } from 'react-redux'
import { TabBar } from '../components'
import MatchListView from './MatchListView'
import { backgroundColor } from '../components/base/theme'
import actions from '../store/actions'
import NavIcon from '../Nav/NavIcon'
import NavTabBarTop from '../Nav/NavTabBarTop'
import { TabNavigator } from 'react-navigation'

class Overview extends Component {


    componentDidMount() {
        const { matches } = this.props

        if (!matches.fetched && !matches.loading) {
            this.props.queryMatches()
        }
    }


    render() {
        const props = {
            error: this.props.matches.error,
            fetched: this.props.matches.fetched,
            onRefresh: this.props.queryMatches.bind(this),
            refreshing: this.props.matches.fetching
        }


        return (
            <ScrollableTabView
                style={{ backgroundColor, flex: 1 }}
                prerenderingSiblingsNumber={2}
                renderTabBar={() => (
                <TabBar />)}>
                <MatchListView {...this.props} { ...props } tabLabel='HEUTE' matches={this.props.matches.today} />
                <MatchListView {...this.props} { ...props } tabLabel='KOMMENDE' matches={this.props.matches.next} />
                <MatchListView {...this.props} { ...props } tabLabel='VERGANGENE' matches={this.props.matches.played} />
            </ScrollableTabView>
        )
    }
}

Overview.navigationOptions = {
    title: 'Übersicht',
    tabBar: {
        icon: ({ tintColor }) => NavIcon('football', tintColor)
    },
    drawer: {
        icon: ({ tintColor }) => NavIcon('football', tintColor)
    }
}

Overview.propTypes = {
    matches: React.PropTypes.object,
    queryMatches: React.PropTypes.func
}

// export default connect(
//     state => ({
//         matches: state.matches
//     }),
//     dispatch => ({
//         queryMatches: () => dispatch(actions.queryMatches())
//     })
//     )(Overview)
class Live extends Component {
    componentDidMount() {
        console.tron.log(this.props.navigation.state.key)
    }
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
    animationEnabnled: true,
    lazyLoad: false
})

Tabs.navigationOptions = {
    title: 'Übersicht'
}

export default Tabs