import React, { Component } from 'react';
import { View } from 'react-native';
import ListItemGroup from './ListItemGroup';
import style from '../Styles/List/ListItemMatch';
import { formatDate, formatTime, isAdminForMatch } from '../../Helper';
import Icon from '../Icon';
import Image from '../Image';
import Score from '../Score';
import { Row, Column, Text } from '../Styles';
import { MATCH, PREVIEW, LIVE_MATCH } from '../../views/routes'

class ListItemMatch extends Component {

    renderTeam(team) {
        return (
            <View style={style.detailsTeam}>
                { this.renderTeamImage(team) }
                <Text style={style.detailsTeamName}>{ team.name }</Text>
            </View>
        );
    }

    renderTeamImage(team) {
        if (team.image) {
            return (<Image url={team.image} size={40} />)
        } else {
            return (<Icon name='shirt' size={46} style={{height: 40}} />)
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
                home: match.team_home,
                away: match.team_away
            });
        }
    }

    render() {
        const match = this.props.data;
        return (
        <ListItemGroup
            padding
            name={`${match.live ? 'LIVE - ':''}${match.league.name} (${match.match_day})`}
            onPress={() => {this.onPress(match)}}>

            <Row>
                <Column fluid>
                    {  match.venue && match.venue.id && (
                    <Text style={style.metaVenue}>
                        <Icon name='pin' /> {match.venue.name}
                    </Text>
                    ) }
                </Column>
                <Column />
                <Column fluid>
                    <Text style={style.metaTime}>
                        { formatDate(match.datetime) + ' '}
                        <Icon name='time' /> { formatTime(match.datetime) }
                    </Text>
                </Column>
            </Row>

            <Row center style={{marginTop: 8}}>
                <Column center>
                    { this.renderTeam(match.team_home) }
                </Column>
                <Column center>
                    <View style={{marginTop: -20}}>
                        <Score setPoints={match} />
                    </View>
                </Column>
                <Column center>
                    { this.renderTeam(match.team_away) }
                </Column>
            </Row>

        </ListItemGroup>);
    }
}



export default ListItemMatch;