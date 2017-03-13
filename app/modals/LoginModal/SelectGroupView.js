import React, { Component } from 'react';
import { Container } from '../../components';
// import { ListItemGroup, ListItem } from '../../components/List';
import { ListItem, Text } from '../../ui';
import { ROUTE_SELECT_TEAM } from './LoginModal'

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
                                        onPress={() => { this.props.navigator.push({ state: ROUTE_SELECT_TEAM, title: 'Team wählen', id: league.id })}}>
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
}

SelectGroupView.propTypes = {
    leagues: React.PropTypes.object,
    getRankings: React.PropTypes.func
};

export default SelectGroupView;