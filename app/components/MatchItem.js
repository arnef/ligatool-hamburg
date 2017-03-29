import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { formatDate, formatTime } from '../Helper'
import Score from './Score'
import { Row, Column, ListItem, Touchable, Icon, Text } from '../components/base'
import { TeamLogo } from '../components'
import { MATCH } from '../views/routes'
import { pushRoute } from '../store/actions/routeActions'

class MatchItem extends Component {

    render() {
        const match = this.props.data

        return (
            <ListItem.Group>
                <Touchable onPress={() => {this.onPress(match)}}>

                <ListItem.Header title={`${match.league.name} (${match.match_day})`}>
                    { match.venue && (<Icon name='pin' />) }
                    { match.venue ? ` ${match.venue.name} · ` : '' }
                    { `${formatDate(match.datetime)} ${formatTime(match.datetime)}`}
                </ListItem.Header>

                <Row center style={{ marginTop: 8 }}>
                    <Column center>
                        <TeamLogo team={match.team_home} big />
                    </Column>
                    <Column fluid center>
                        <Score setPoints={match} />
                    </Column>
                    <Column center>
                        <TeamLogo team={match.team_away} big />
                    </Column>
                </Row>

                <Row>
                    <Column center>
                        <Text center>{ match.team_home.name }</Text>
                    </Column>
                    <Column fluid center style={{ width: 60 }}>
                        { match.live && (<Text color={this.props.settings.color} size={12} bold>LIVE</Text>) }
                    </Column>
                    <Column center>
                        <Text center>{ match.team_away.name }</Text>
                    </Column>
                </Row>

                </Touchable>
            </ListItem.Group>
        )
    }

    /**
     *
     * @param {object} match
     */
    onPress(match) {
        this.props.pushRoute({
            id: match.id,
            state: MATCH
        })
    }
}

MatchItem.propTypes = {
    data: PropTypes.object,
    pushRoute: PropTypes.func,
    settings: PropTypes.object
}

export default connect(
    state => ({
        settings: state.settings
    }),
    dispatch => ({
        pushRoute: (route) => dispatch(pushRoute(route))
    })
)(MatchItem)
