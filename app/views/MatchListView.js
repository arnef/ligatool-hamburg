import React, { Component } from 'react';
import { ListItemMatch } from '../components/List';
import { Container, Text } from '../components';

class MatchListView extends Component {

    constructor(props) {
        super(props);
        this._renderMatch.bind(this);
    }

    _renderMatch(match, sec, idx) {
        return (
            <ListItemMatch
                key={idx}
                data={match} navigator={this.props.navigator} />
        );
    }

    render() {
        return (
            <Container
                error={this.props.error}
                refreshing={this.props.refreshing}
                onRefresh={this.props.onRefresh}
                dataSource={this.props.matches}
                renderRow={this._renderMatch.bind(this)}
             />
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
