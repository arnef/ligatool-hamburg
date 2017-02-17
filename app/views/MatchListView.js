import React, { Component } from 'react';
import { ListItemMatch } from '../components/List';
import { Container } from '../components';

class MatchListView extends Component {

    _renderMatch(match) {
       return (
        <ListItemMatch 
            key={match.id}
            data={match} navigator={this.props.navigator} />
        );
    }

    render() {
        return (
            <Container 
                error={this.props.error}
                refreshing={this.props.refreshing}
                onRefresh={this.props.onRefresh}>
                    { this.props.matches.map(match => {
                        return this._renderMatch(match);
                    }) }
            </Container>
        );
    }
}

MatchListView.propTypes = {
    onRefresh: React.PropTypes.func,
    matches: React.PropTypes.array,
    navigator: React.PropTypes.object,
    error: React.PropTypes.string,
    refreshing: React.PropTypes.bool
};

export default MatchListView;
