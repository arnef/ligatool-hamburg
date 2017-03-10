import React, { Component } from 'react';
import ListItemGroup from './ListItemGroup';
import { formatDate, formatTime, isAdminForMatch } from '../../Helper';
import Icon from '../Icon';
import Image from '../Image';
import Score from '../Score';
import { Text } from '../Styles';
import { Row, Column } from '../../ui';
import { MATCH, PREVIEW, LIVE_MATCH } from '../../views/routes'

class ListItemMatch extends Component {

    renderTeam(team) {
        return (
            <Row center>
                
            </Row>
        );
    }

    renderTeamImage(team) {
        if (team.image) {
            return (<Image url={team.image} size={32} style={{margin: 4}} />)
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

    render() {
        const match = this.props.data;
        return (
        <ListItemGroup
            padding
            name={`${match.live ? 'LIVE - ':''}${match.league.name} (${match.match_day})`}
            onPress={() => {this.onPress(match)}}>
            <Row>
            <Column>
                    {  match.venue && match.venue.id && (
                    <Text size={12} numberOfLines={1}>
                        <Icon name='pin' /> {match.venue.name}
                    </Text>
                    ) }
            </Column>
            <Column>
                    <Text size={12} style={{flex: 1, textAlign: 'right'}}>
                        <Icon name='time' />&nbsp;
                        { formatDate(match.datetime) } &nbsp;
                         { formatTime(match.datetime) }
                    </Text>
                </Column>
            </Row>
            
            <Row style={{marginTop: 8}}>
                <Column center>
                    { this.renderTeamImage(match.team_home) }
                    <Text center style={{paddingHorizontal: 4}}>{ match.team_home.name }</Text>
                </Column>
                <Column fluid>
                    <Score setPoints={match} style={{marginTop: 10}}/>
                </Column>
                <Column center>
                    { this.renderTeamImage(match.team_away) }
                    <Text center style={{paddingHorizontal: 4}}>{ match.team_away.name }</Text>
                </Column>
            </Row>

        </ListItemGroup>);
    }
}



export default ListItemMatch;