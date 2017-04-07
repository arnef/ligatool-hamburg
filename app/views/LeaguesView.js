import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import actions from '../store/actions'
import { View } from 'react-native'
import { Container } from '../components'
import NavDrawerIcon from '../Nav/NavDrawerIcon'

import { ListItem, Text } from '../components/base'
import NavIcon from '../Nav/NavIcon'
import LeagueView from './LeagueView'
import SelectableMatchListView from './SelectableMatchListView'

import { StackNavigator, NavigationActions } from 'react-navigation'
import NavHeader from '../Nav/NavHeader'
import TeamView from './TeamView'
import MatchView from './MatchView'
import Preview from './MatchView/PreView'
import { LEAGUES_NAVIGATOR, LEAGUES, MATCH, PREVIEW, TEAM, LEAGUE, LEAGUE_CUP } from './routes'


class LeaguesView extends Component {

    componentDidMount() {
        const { leagues } = this.props

        if (!leagues.fetched && !leagues.loading) {
            this.props.getRankings()
        }
    }


    render() {
        return (
            <Container
                { ...this.props }
                error={ this.props.leagues.error }
                refreshing={this.props.leagues.loading}
                onRefresh={this.props.getRankings.bind(this)}>
                { this.props.leagues.data.length > 0 && (
                <ListItem.Group>
                { this.props.leagues.data.map( (league, idx) => {
                    return (
                        <View key={league.id}>
                            <ListItem
                                last={idx === this.props.leagues.data.length-1}
                                onPress={() => this.onPress(league)}>
                                <Text>{ league.name }</Text>
                            </ListItem>
                        </View>
                    )
                })}
                </ListItem.Group>
                )}
            </Container>
        )
    }

    onPress(league) {
        const { dispatch } = this.props

        dispatch(NavigationActions.navigate({
            routeName: league.cup ? 'LeagueCupMatches' : 'League',
            params: {
                id: league.id,
                title: league.name,
                cup: league.cup ? league.name : undefined
            }
        }))
    }
}

LeaguesView.navigationOptions = {
    title: 'Gruppen',
    tabBar: {
        icon: ({ tintColor }) => NavIcon('trophy', tintColor)
    }
}

LeaguesView.propTypes = {
    dispatch: PropTypes.func,
    getRankings: PropTypes.func,
    leagues: PropTypes.object,
    pushRoute: PropTypes.func
}
SelectableMatchListView.navigationOptions = {
    title: ({ state }) => state.params.cup || 'Begegnungen',
    header: NavDrawerIcon
}

export default StackNavigator({
    [LEAGUES]: { screen: connect(
        state => ({
            leagues: state.leagues
        }),
        dispatch => ({
            getRankings: () => dispatch(actions.getRankings()),
            pushRoute: (route) => dispatch(actions.pushRoute(route)),
            dispatch: (action) => dispatch(action)
        })
        )(LeaguesView)
    },
    [LEAGUE]: { screen: LeagueView },
    [LEAGUES_NAVIGATOR + TEAM]: { screen: TeamView },
    [LEAGUES_NAVIGATOR + MATCH]: { screen: MatchView },
    [LEAGUES_NAVIGATOR + PREVIEW]: { screen: Preview },
    [LEAGUE_CUP]: { screen: SelectableMatchListView }
}, {
    ...NavHeader
})
