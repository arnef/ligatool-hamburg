import React, { Component } from 'react';
import { Container } from '../../components';
import { ListItem, Text } from '../../components/base';
// import { ROUTE_SELECT_TEAM } from './LoginModal'
import { MODAL_SELECT_TEAM } from '../../views/routes'

class SelectGroupView extends Component {
    

    componentDidMount() {
        if (this.props.leagues.data.length === 0) {
            this.props.getRankings();
        }
    }

    render() {
        return (
            <Container
                error={this.props.leagues.error}
                refreshing={this.props.leagues.loading}
                onRefresh={this.props.getRankings.bind(this)}>
                { this.props.leagues.data.length > 0 && (
                    <ListItem.Group>
                        { this.props.leagues.data.map((league,idx) => {
                            if (!league.cup) {
                                return (
                                    <ListItem key={league.id}
                                        last={idx >= this.props.leagues.data.length -2}
                                        onPress={() => this.onPress(league)}>
                                        <Text>{ league.name }</Text>
                                    </ListItem>
                                );
                            }
                        })}
                    </ListItem.Group>
                )}
            </Container>
        );
    }

    onPress(league) {
        this.props.navigator.push({ 
            state: MODAL_SELECT_TEAM, 
            title: 'Team wählen', 
            id: league.id 
        })
    }
}

SelectGroupView.propTypes = {
    leagues: React.PropTypes.object,
    getRankings: React.PropTypes.func
};

export default SelectGroupView;