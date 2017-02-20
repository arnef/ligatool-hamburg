import React, { Component } from 'react';
import { ListItemMatch } from '../components/List';
import { Container, Text } from '../components';

class MatchListView extends Component {

    _renderMatch(match, idx) {
       return (
        <ListItemMatch 
            key={idx}
            data={match} navigator={this.props.navigator} />
        );
        // return (<Text>{ JSON.stringify(match)}</Text>);
    }

    render() {
        return (
            <Container 
                error={this.props.error}
                refreshing={this.props.refreshing}
                onRefresh={this.props.onRefresh}>
                    { this.props.matches.map((match, idx) => {
                        return this._renderMatch(match, idx);
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
