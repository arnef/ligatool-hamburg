import React, { Component } from 'react'
import { View, Linking, Alert, Platform } from 'react-native'
import { connect } from 'react-redux'
import { getTeam } from '../../store/actions/teamActions'
import { Container } from '../../components'
import { Row, Column, Button, ListItem, Image, Text } from '../../components/base'

class TeamView extends Component {


    componentDidMount() {
        // if (this.props.navigator) {
        //     this.props.navigator.setTitle(this.props.team.name)
        // }
        if (!this.getTeam()) {
            this.loadTeam()
            console.tron.log('get team')
        }

    }

    render() {
        const team = this.getTeam() || this.props.team

        return (
            <Container
                { ...this.props }
                error={this.props.teams.error}
                refreshing={this.props.teams.loading}
                onRefresh={this.loadTeam.bind(this)} >
                { this.renderTeamDetails(team) }
                { team.player && this.renderTeamPlayer(team.player) }
            </Container>
        )
    }

    renderTeamDetails(team) {
        const leftWidth = 5

        return (
            <ListItem.Group >
                <ListItem.Header title='Details' />
                <View style={{ height: 10 }} />
                { !!team.image && (
                    <Row center>
                        <Image url={team.image} size={240} />
                    </Row>
                )}
                { !!team.league && (
                    <Row>
                        <Column width={leftWidth}>
                            <Text bold>Gruppe</Text>
                        </Column>
                        <Column>
                            <Text>{ team.league.name }</Text>
                            { !!team.position && (
                                <Text>{ team.position }. Platz</Text>
                            )}
                        </Column>
                    </Row>
                )}
                { !!team.club && !!team.club.id && (
                    <Row>
                        <Column width={leftWidth}><Text bold>Verein</Text></Column>
                        <Column><Text>{ team.club.name }</Text></Column>
                    </Row>)}
                { !!team.table && (
                    <Row>
                        <Column width={leftWidth}><Text bold>Heimtisch</Text></Column>
                        <Column><Text>{ team.table }</Text></Column>
                    </Row>
                )}
                { !!team.contact && (
                    <Row>
                        <Column width={leftWidth}><Text bold>Kontakt</Text></Column>
                        <Column>
                            { team.contact.map( contact => {
                                return (<View key={contact.id}>
                                    <Text>{ `${contact.name} ${contact.surname}` }</Text>
                                    <Row style={{ paddingHorizontal: 0 }}>
                                        <Column>
                                            <Button onPress={() => { this.openTel(contact.phone_number) }}>Anrufen</Button>
                                        </Column>
                                        <Column fluid style={{ width: 8 }} />
                                        <Column>
                                            <Button onPress={() => { this.openMail(contact.email) }}>E-Mail</Button>
                                        </Column>
                                    </Row>
                                </View>)
                            })}
                        </Column>
                    </Row>
                ) }
                { !isNaN(parseInt(team.home_match_day, 10)) && (
                    <Row>
                        <Column width={leftWidth}><Text bold>Heimspielzeit</Text></Column>
                        <Column>
                            <Text>{ weekdays[team.home_match_day] }
                                { !!team.home_match_time && (<Text> um {team.home_match_time}</Text>)}
                            </Text>
                        </Column>
                    </Row>
                )}
                { !!team.venue && !!team.venue.id && (
                    <Row>
                        <Column width={leftWidth}>
                            <Text bold>Heimspielort</Text>
                        </Column>
                        <Column>
                            <Text>{ team.venue.name }</Text>
                            <Text>{ team.venue.street }</Text>
                            <Text>{ team.venue.zip_code } { team.venue.city }</Text>

                            <Button icon='map' onPress={() => { this.openMaps(team.venue)}}>Karte</Button>

                        </Column>
                    </Row>
                )}
            </ListItem.Group>
        )
    }

    renderTeamPlayer(players) {
        const rows = []

        for (let i = 0; i < players.length; i+= 2) {
            const row = []

            row.push(players[i])
            if ((i + 1) < players.length) {
                row.push(players[i + 1])
            }
            rows.push(row)
        }

        return (
            <ListItem.Group>
                <ListItem.Header title='Spieler' />
                <View style={{ margin: 10 }}>
                { rows.map( (row, idx) => {
                    return (
                        <Row key={idx} style={{ paddingVertical: 8 }}>
                            { this.renderPlayer(row[0]) }
                            { this.renderPlayer(row.length === 2 ? row[1] : null) }
                        </Row>
                    )
                }) }
                </View>
            </ListItem.Group>
        )
    }

    renderPlayer(player) {
        if (player === null) {
            return (<Column center></Column>)
        }

        return (
            <Column center>
                <Image url={player.image} height={120} width={90} />
                <Text center>{ `${player.name} ${player.surname}` }</Text>
            </Column>
        )
    }

    getTeam() {
        const teamID = `${this.props.team.id}`

        return this.props.teams.id[teamID] ? this.props.teams.id[teamID].details : null
    }

    loadTeam() {
        const teamID = this.props.team.id

        this.props.getTeam(teamID)
    }

    openMail(email) {
        Linking.openURL('mailto:' + email).catch(() => {
            Alert.alert('Keine Mail-App', email)
        })
    }

    openTel(number) {
        Linking.openURL('tel:' + number).catch(() => {
            Alert.alert('Keine Telefon-App', number)
        })
    }

    openMaps(venue) {
        const address = `${venue.street} ${venue.zip_code} ${venue.city}`
        const prefix = Platform.OS === 'ios' ? 'http://maps.apple.com/?address=' : 'geo:53.5586526,9.6476386?q='

        Linking.openURL(prefix + encodeURI(address)).catch(() => {
            Alert.alert('Keine Karten-App')
        })

    }
}


const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']


TeamView.propTypes = {
    getTeam: React.PropTypes.func,
    team: React.PropTypes.object,
    teams: React.PropTypes.object
}

export default connect(
    state => ({
        teams: state.teams
    }),
    dispatch => ({
        getTeam: (id) => dispatch(getTeam(id))
    })
)(TeamView)