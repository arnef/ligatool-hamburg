import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import actions from '../store/actions'
import { Container, TeamLogo } from '../components'
import { Text, ListItem, Column } from '../components/base'
import { TEAM } from '../views/routes'

class TableView extends Component {

    componentDidMount() {
        if (!this.props.league.id[this.props.leagueID]) {
            this._getLeagues()
        }
    }

    _renderTeam(data, idx, last) {
        return (
        <ListItem last={last} key={idx}
            maxHeight={idx === -1 ? 30 : 0}
            onPress={idx !== -1 ? () => { this._onPress(data) } : null}>
            <Column center fluid style={{ width: 24 }}>
            <Text bold>{data.position}</Text>
            </Column>
            { idx !== -1 && (<TeamLogo team={data} /> ) }
            <Column style={{ paddingLeft: 4 }}>
            <Text numberOfLines={1} ellipsizeMode='tail'>{data.name}</Text>
            </Column>
            <Column center fluid style={{ minWidth: 35 }}>
            <Text >{data.matches}</Text>
            </Column>
            <Column center fluid style={{ minWidth: 35 }}>
            <Text >{data.set_points_diff}</Text>
            </Column>
            <Column center fluid style={{ minWidth: 35 }}>
            <Text>{data.goals_diff}</Text>
            </Column>
            <Column center fluid style={{ minWidth: 35 }}>
            <Text bold>{data.points}</Text>
            </Column>
        </ListItem>
        )
    }

    _onPress(team) {
        this.props.pushRoute({
            state: TEAM,
            team: team,
            title: team.name
        })
    }

    _getLeagues() {
        this.props.getLeague(this.props.leagueID)
    }

    render() {
        const table = this.props.league.id[this.props.leagueID] ? this.props.league.id[this.props.leagueID].table : []

        return (
        <Container
            { ...this.props }
            error={this.props.league.error}
            refreshing={this.props.league.loading}
            onRefresh={this._getLeagues.bind(this)}>
            { table.length > 0 && (
            <ListItem.Group>
                { !this.props.league.error && this._renderTeam({
                    goals_diff: 'Tore',
                    matches: 'Sp.',
                    points: 'Pkt.',
                    position: '',
                    set_points_diff: 'Sätze',
                    team: ''
                }, -1)}
                {table.map((team, idx) => {
                    return this._renderTeam(team, idx, idx === table.length-1)
                })}
            </ListItem.Group>) }
        </Container>
        )
    }
}

TableView.propTypes = {
    getLeague: PropTypes.func,
    league: PropTypes.object,
    leagueID: PropTypes.number,
    pushRoute: PropTypes.func
}

export default connect(
    state => ({
        league: state.league
    }),
    dispatch => ({
        getLeague: (id) => dispatch(actions.getLeague(id)),
        pushRoute: (route) => dispatch(actions.pushRoute(route))
    })
)(TableView)
