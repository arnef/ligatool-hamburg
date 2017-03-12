import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formatDate, formatTime, isAdminForMatch } from '../../Helper';
import Icon from '../Icon';
import Image from '../Image';
import Score from '../Score';
import { View, Linking, Platform } from 'react-native';
import { Row, Column, Text, ListItem, Touchable } from '../../ui';
import { MATCH, PREVIEW, LIVE_MATCH, TEAM } from '../../views/routes';
import styles from '../../style';

class ListItemMatch extends Component {

    constructor(props) {
        super(props);
        this.state = { showOptions: false };
    }
    

    renderTeamImage(team) {
        if (team.image) {
            return (<Image url={team.image} size={36} style={{margin: 4}} />)
        } else {
            return (<Icon name='shirt' size={36} style={{height: 32, margin: 4}} />)
        }
    }

    onPress(match) {
        if (isAdminForMatch(match)) {
            this.props.navigator.push({
                state: MATCH,
                title: 'Spiel eintragen',
                id: match.id
            });
        } else if (match.set_points) {
            this.props.navigator.push({
                state: LIVE_MATCH,
                title: 'Begegnung',
                id: match.id
            });
        } else {
            this.props.navigator.push({
                state: PREVIEW,
                title: match.team_home.name,
                home: match.team_home,
                away: match.team_away
            });
        }
    }

    onInsertScore(match) {
        this.props.navigator.push({
                state: MATCH,
                title: 'Spiel eintragen',
                id: match.id
        });
        this.setState({ showOptions: false });
    }

    onOpenTeam(team) {
        
        this.props.navigator.push({
            state: TEAM,
            title: team.name,
            team:team
        });
        this.setState({ showOptions: false });
    }

    onOpenVenue(venue) {
        const address = `${venue.street} ${venue.zip_code} ${venue.city}`;
        const prefix = Platform.OS === 'ios' ? 'http://maps.apple.com/?address=' : 'geo:53.5586526,9.6476386?q=';
        Linking.openURL(prefix + encodeURI(address)).catch(ex => {
            Alert.alert('Keine Karten-App');
        });
        this.setState({ showOptions: false });
    }

    renderOptions() {
        const match = this.props.data;
        return (
            <View>
                { isAdminForMatch(match) && (<ListItem onPress={() => { this.onInsertScore(match); }}>Ergebnisse eintragen</ListItem>) }
                <ListItem onPress={() => { this.onOpenVenue(match.venue); }}>Spielort anzeigen</ListItem>
                <ListItem onPress={() => { this.onOpenTeam(match.team_home); }}>Heimteam anzeigen</ListItem>
                <ListItem onPress={() => { this.onOpenTeam(match.team_away); }} last>Gastteam anzeigen</ListItem>
            </View>
        );
    }

    render() {
        const match = this.props.data;
        return (
        <ListItem.Group>
            <Text bold color={this.props.settings.color}
            style={{marginHorizontal: 10, marginTop: 10}}>

                {`${match.league.name} (${match.match_day})`}
            </Text>
            <Touchable 
                onPress={!this.state.showOptions ? () => {this.onPress(match)} : null}>
                <Text secondary size={12}
                    style={{marginHorizontal: 10}}>
                    <Icon name='pin'/> {match.venue.name} 
                    &nbsp;&middot;&nbsp;
                    { `${formatDate(match.datetime)} ${formatTime(match.datetime)}` }
                </Text>
                <View style={{margin: 10}}>
            <Row center >
                <Row center>
                    <Column>
                        <Text center numberOfLines={3}>{ match.team_home.name }</Text>
                    </Column>
                    <Column fluid>
                        { this.renderTeamImage(match.team_home) }
                    </Column>
                </Row>

                <Column center fluid>
                    <Score setPoints={match} live={match.live} />
                </Column>

                <Row center>
                    <Column fluid>                    
                    { this.renderTeamImage(match.team_away) }
                    </Column>
                    <Column>
                    <Text center numberOfLines={3}>{ match.team_away.name }</Text>
                    </Column>
                </Row>
                </Row>
                { match.live && (<Row style={{marginTop: -4}}>
                <Column center>
                    <Text style={styles.scoreLive}>LIVE</Text>
                </Column>
            </Row>)}
            

            </View>

            </Touchable>
        </ListItem.Group>);
    }
}



export default connect(state => ({ settings: state.settings }))(ListItemMatch);