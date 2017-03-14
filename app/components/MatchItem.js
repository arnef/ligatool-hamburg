import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formatDate, formatTime, isAdminForMatch } from '../Helper';
import Score from './Score';
import { Row, Column, ListItem, Touchable, Icon, Text } from '../components/base';
import { TeamLogo } from '../components';
import { MATCH, PREVIEW, LIVE_MATCH } from '../views/routes';

class MatchItem extends Component {

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
            <ListItem.Group>
                <Touchable onPress={() => {this.onPress(match)}}>

                <ListItem.Header title={`${match.league.name} (${match.match_day})`}>
                    <Icon name='pin' />
                    &nbsp;
                    { match.venue.name }
                    &nbsp;&middot;&nbsp;
                    { `${formatDate(match.datetime)} ${formatTime(match.datetime)}`}
                </ListItem.Header>
                
                <Row center style={{marginTop: 10, marginBottom: 6, marginHorizontal: 10}}>
                    <Column center>
                        <TeamLogo url={match.team_home.image} big />
                    </Column>
                    <Column fluid center>
                        <Score setPoints={match} />
                    </Column>
                    <Column center>
                        <TeamLogo url={match.team_away.image} big />
                    </Column>
                </Row>

                <Row style={{marginBottom: 10, marginHorizontal: 10}}>
                    <Column center>
                        <Text center>{ match.team_home.name }</Text>
                    </Column>
                    <Column fluid center style={{width: 60}}>
                        { match.live && (<Text color={this.props.settings.color} size={12} bold>LIVE</Text>) }
                    </Column>
                    <Column center>
                        <Text center>{ match.team_away.name }</Text>
                    </Column>
                </Row>

                </Touchable>
            </ListItem.Group>
        );
    }
}

export default connect(state => ({ settings: state.settings }))(MatchItem);
