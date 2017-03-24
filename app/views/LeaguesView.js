import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import actions from '../store/actions'
import { View } from 'react-native'
import { Container } from '../components'

import { RANKING, LEAGUE_MATCHES } from './routes'
import { ListItem, Text } from '../components/base'

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
        if (league.cup) {
            this.props.pushRoute({
                leagueID: league.id,
                state: LEAGUE_MATCHES,
                title: league.name
            })
        } else {
            this.props.pushRoute({
                leagueID: league.id,
                state: RANKING,
                title: league.name
            })
        }
    }
}

LeaguesView.propTypes = {
    getRankings: PropTypes.func,
    leagues: PropTypes.object,
    pushRoute: PropTypes.func
}

export default connect(
    state => ({
        leagues: state.leagues
    }),
    dispatch => ({
        getRankings: () => dispatch(actions.getRankings()),
        pushRoute: (route) => dispatch(actions.pushRoute(route))
    })
)(LeaguesView)