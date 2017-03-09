import React, { Component } from 'react';
import { Container } from '../../components';
import { connect } from 'react-redux';
import { ListItemGroup, ListItem } from '../../components/List';
import { ROUTE_LOGIN } from './LoginModal';


class SelectTeamView extends Component {

    componentDidMount() {
        if (!this.props.league.id[this.props.id]) {
            this.getTeams();
        }
    }


    render() {
        const teams = this.props.league.id[this.props.id] ? 
            JSON.parse(JSON.stringify(this.props.league.id[this.props.id].table)) : [];
        // sort teams alphabetically
        
        teams.sort((a, b) => {
            return a.name < b.name ? -1 : 1;
        });
        return (
            <Container
                error={this.props.league.error}
                refreshing={this.props.league.loading}
                onRefresh={this.getTeams.bind(this)}>
                { teams.length > 0 && (
                    <ListItemGroup>
                        { teams.map( team => {
                            return (
                                <ListItem 
                                    onPress={() => { this.onPress(team); }}
                                    key={team.id}
                                    image={team.image} 
                                    icon={!team.image ? 'shirt' : null}>
                                    { team.name }
                                </ListItem>
                            );
                        })}
                    </ListItemGroup>
                )}
            </Container>
        );
    }


    getTeams() {
        this.props.getLeague(this.props.id);
    }

    onPress(team) {
        this.props.setUserTeam(team);
        this.props.navigator.push({ state: ROUTE_LOGIN, title: 'Login'});
    }

}

SelectTeamView.propTypes = {
    league: React.PropTypes.object,
    id: React.PropTypes.number,
    getLeague: React.PropTypes.func,
    setUserTeam: React.PropTypes.func,
    navigator: React.PropTypes.object
};

export default connect(state => ({
    ...state
}))(SelectTeamView);