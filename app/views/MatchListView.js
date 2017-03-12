import React, { Component } from 'react';
import { ListItemMatch } from '../components/List';
import { Container, Text } from '../components';
import { Row, Column, Button } from '../ui';

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

    componentDidMount() {
        if (this.props.matches.length === 0 && this.props.refreshOnMount) {
            this.props.onRefresh();
        }
    }

    render() {
        if (this.props.error) {
            return (
                <Container
                    { ...this.props }>
                    <Row style={{marginTop: 16}}>
                        <Column center>
                            <Button onPress={this.props.onRefresh}>Erneut Laden</Button>
                        </Column>
                    </Row>
                </Container>
            )
        }
        if (this.props.fetched && this.props.matches.length === 0) {
            return (
                <Container 
                    { ...this.props }
                    error={this.props.error}
                    refreshing={this.props.refreshing}
                    onRefresh={this.props.onRefresh}>
                    <Text center style={{padding: 16}}>Keine Begegnungen</Text>
                </Container>  
            )
        }
        return (
            <Container
                { ...this.props }
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
    fetched: React.PropTypes.bool,
    matches: React.PropTypes.array,
    navigator: React.PropTypes.object,
    error: React.PropTypes.string,
    refreshing: React.PropTypes.bool
};

export default MatchListView;
