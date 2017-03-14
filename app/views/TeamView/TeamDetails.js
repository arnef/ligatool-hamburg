import React, { Component } from 'react';
import { View, Linking, Alert, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Container } from '../../components';
import { Row, Column, Button, ListItem, Image, Text } from '../../components/base';

class TeamView extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.navigator) {
            this.props.navigator.setTitle(this.props.team.name);
        }
        if (!this.getTeam()) {
            this.loadTeam();
            console.tron.log('get team');
        }
     
    }

    render() {
        const team = this.getTeam() || this.props.team;

        return (
            <Container 
                { ...this.props }
                error={this.props.teams.error}
                refreshing={this.props.teams.loading}
                onRefresh={this.loadTeam.bind(this)} >
                { this.renderTeamDetails(team) }
                { team.player && this.renderTeamPlayer(team.player) }
            </Container>
        );
    }

    renderTeamDetails(team) {
        const leftWidth = 5;
        return (
            <ListItem.Group >
                <ListItem.Header title='Details' />
                { !!team.image && (
                    <View style={{alignItems: 'center', margin: 10}}>
                        <Image url={team.image} size={240} />
                    </View>
                )}
                { !!team.club && !!team.club.id && (
                    <Row style={{marginHorizontal:10}} >
                        <Column width={leftWidth}><Text bold>Verein</Text></Column>
                        <Column><Text>{ team.club.name }</Text></Column>
                    </Row>)}
                { !!team.table && (
                    <Row style={{marginHorizontal:10}} >
                        <Column width={leftWidth}><Text bold>Heimtisch</Text></Column>
                        <Column><Text>{ team.table }</Text></Column>
                    </Row>
                )}
                { !!team.contact && (
                    <Row style={{marginHorizontal:10}} >
                        <Column width={leftWidth}><Text bold>Kontakt</Text></Column>
                        <Column>
                            { team.contact.map( contact => {
                                return (<View key={contact.id}>
                                    <Text>{ `${contact.name} ${contact.surname}` }</Text>
                                    <Row center style={{marginVertical: 8}}>
                                        <View style={{flex: 1}}>
                                            <Button icon='call' onPress={() => { this.openTel(contact.phone_number) }}>Anrufen</Button>
                                        </View>
                                        <Column fluid style={{width: 8}} />
                                        <View style={{flex: 1}}>
                                            <Button icon='mail' onPress={() => { this.openMail(contact.email) }}>E-Mail</Button>
                                        </View>
                                    </Row>
                                </View>)
                            })}
                        </Column>
                    </Row>
                ) }
                { !isNaN(parseInt(team.home_match_day, 10)) && (
                    <Row style={{marginHorizontal:10}} >
                        <Column width={leftWidth}><Text bold>Heimspielzeit</Text></Column>
                        <Column>
                            <Text>{ weekdays[team.home_match_day] }
                                { !!team.home_match_time && (<Text> um {team.home_match_time}</Text>)}
                            </Text>
                        </Column>
                    </Row>
                )}
                { !!team.venue && !!team.venue.id && (
                    <Row style={{marginHorizontal:10}} >
                        <Column width={leftWidth}>
                            <Text bold>Heimspielort</Text>
                        </Column>
                        <Column>
                            <Text>{ team.venue.name }</Text>
                            <Text>{ team.venue.street }</Text>
                            <Text>{ team.venue.zip_code } { team.venue.city }</Text>
                            <View style={{marginVertical: 8}}>
                                <Button icon='map' onPress={() => { this.openMaps(team.venue)}}>Karte</Button>
                            </View>
                        </Column>
                    </Row>
                )}
            </ListItem.Group>
        );
    }

    renderTeamPlayer(players) {
        const rows = [];
        for (let i = 0; i < players.length; i+= 2) {
            const row = [];
            row.push(players[i]);
            if ((i + 1) < players.length) {
                row.push(players[i + 1])
            }
            rows.push(row);
        }
        return (
            <ListItem.Group>
                <ListItem.Header title='Spieler' />
                <View style={{margin: 10}}>
                { rows.map( (row, idx) => {
                    return (
                        <Row key={idx} style={{paddingVertical: 8}}>
                            { this.renderPlayer(row[0]) }
                            { this.renderPlayer(row.length === 2 ? row[1] : null) }
                        </Row>
                    );
                }) }
                </View>
            </ListItem.Group>
        );
    }

    renderPlayer(player) {
        if (player === null) {
            return (<Column center></Column>);
        }
        return (
            <Column center>
                <Image url={player.image} height={120} width={90} />
                <Text>{ `${player.name} ${player.surname}` }</Text>
            </Column>
        )
    }

    getTeam() {
        const teamID = `${this.props.team.id}`;
        return this.props.teams.id[teamID] ? this.props.teams.id[teamID].details : null;
    }

    loadTeam() {
        const teamID = this.props.team.id;
        this.props.getTeam(teamID);
    }

    openMail(email) {
        Linking.openURL('mailto:' + email).catch(ex => {
            Alert.alert('Keine Mail-App', email);
        });
    }

    openTel(number) {
        Linking.openURL('tel:' + number).catch(ex => {
            Alert.alert('Keine Telefon-App', number);
        });
    }

    openMaps(venue) {
        const address = `${venue.street} ${venue.zip_code} ${venue.city}`;
        const prefix = Platform.OS === 'ios' ? 'http://maps.apple.com/?address=' : 'geo:53.5586526,9.6476386?q=';
        Linking.openURL(prefix + encodeURI(address)).catch(ex => {
            Alert.alert('Keine Karten-App');
        });

    }
}


const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];


TeamView.propTypes = {
    navigator: React.PropTypes.object,
    team: React.PropTypes.object,
    teams: React.PropTypes.object,
    getTeam: React.PropTypes.func
};

export default connect(state => ({
    teams: state.teams
}))(TeamView);