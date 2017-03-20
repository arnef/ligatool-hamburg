import React, { Component } from 'react'
import { Container, MatchItem  } from '../components'
import { Row, Column, Button, Text } from '../components/base'
import { isAdminForMatch } from '../Helper'
import { LIVE_MATCH, MATCH, PREVIEW } from '../views/routes'


class MatchListView extends Component {

    constructor(props) {
        super(props);
        this._renderMatch.bind(this);
        this.state={
            openMenu: -1
        }
    }

    _renderMatch(match, sec, idx) {
        return (
            <MatchItem
                key={idx}
                menuOpen={this.state.openMenu === idx}
                onPress={() => this.onPress(match) }
                toggleMenu={() => {this.toggleMenu(idx) }}
                data={match} navigator={this.props.navigator} />
        )
    }

    onPress(match) {
        if (isAdminForMatch(match)) {
            this.props.pushRoute({
                state: MATCH,
                title: 'Spiel eintragen',
                id: match.id
            })
        } else if (match.set_points) {
            this.props.pushRoute({
                state: LIVE_MATCH,
                title: 'Begegnung',
                id: match.id
            })
        } else {
            this.props.pushRoute({
                state: PREVIEW,
                title: match.team_home.name,
                home: match.team_home,
                away: match.team_away
            });
        }
    }

    componentDidMount() {
        if (this.props.matches.length === 0 && this.props.refreshOnMount) {
            this.props.onRefresh();
        }
        
    }

    toggleMenu(idx) {
        console.tron.log('open ' + idx);
        const openMenu = this.state.openMenu === idx ? -1 : idx;
        this.setState({ openMenu });
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
                    <Text center secondary style={{padding: 16}}>Keine Begegnungen</Text>
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
    pushRoute: React.PropTypes.func,
    onRefresh: React.PropTypes.func,
    fetched: React.PropTypes.bool,
    matches: React.PropTypes.array,
    navigator: React.PropTypes.object,
    error: React.PropTypes.string,
    refreshing: React.PropTypes.bool
};

export default MatchListView;
