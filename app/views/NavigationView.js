import React, { Component } from 'react';
import { View, ScrollView, Text, ActivityIndicator } from 'react-native';
import { ListItemDrawer } from '../components/List';
import { Image } from '../components';
import { Button } from '../ui';
import { RANKING, OVERVIEW, MY_TEAM, SETTINGS } from '../views/routes';

class NavigationView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activePage: OVERVIEW,
            activeLeague: -1
        };
    }

    componentDidMount() {
        this.props.getRankings();
    }

    _handleRowPress(state) {
        if (state.title === 'Login') {
            state.title = null;
        }
        if (this.props.onNavigate) {
            this.props.onNavigate(state);
        }
        this.setState({
            activePage: state.state,
            activeLeague: state.leagueID ? state.leagueID : -1
        });
    }

    _renderItem(state, text, icon) {
        return (
            <ListItemDrawer 
                active={this.state.activePage === state}
                onPress={() => { this._handleRowPress({ state: state, title: text} ); }}
                icon={icon}>
                { text }
            </ListItemDrawer>
        );
    }

    renderLeagues() {
        return this.props.leagues.data.map( (league) => {
            if (!league.cup) {
                return (
                    <ListItemDrawer key={league.id}
                        active={league.id === this.state.activeLeague}
                        onPress={ () => {
                            this._handleRowPress({state: RANKING, leagueID: league.id, title: league.name})
                        }}>
                        { league.name }
                    </ListItemDrawer>
                );
            }
        });
    }

    render () {
        const height = Math.floor(this.props.width * 0.625);
        const team = this.props.settings.team || null;

        return (
            <View style={{flex: 1}}>
            <View style={{ width: this.props.width, height: height, overflow: 'hidden'}}>
                <Image
                    style={{ resizeMode: 'cover', width: this.props.width, height: height}}
                    source={ team ? require('../../res/img/turm_bw.png') : require('../../res/img/turm.png') } />
                    { team && (
                    <View style={{flexDirection: 'row', position: 'absolute', top: height-66, alignItems: 'center', width: this.props.width, height: 60 }}>
                        { team.image && (
                            <Image url={team.image}  style={{ width: 60, height: 60, marginLeft: 8}} />
                        )}
                        <Text style={{color: '#ffffff', fontSize: 24, marginLeft: 16, flex: 1 }}>
                            { team.name }
                        </Text>
                    </View>
                    )}
                </View>
                <ScrollView style={{flex: 1}}>
                    { this._renderItem(OVERVIEW, 'Übersicht', 'football') }
                    { this._renderItem(MY_TEAM, team ? 'Mein Team': 'Team wählen', team ? 'shirt': 'log-in')}
                    <ListItemDrawer.Separator />
                    {
                        !this.props.leagues.loading && (this.props.leagues.error || this.props.leagues.data.length === 0)  && (
                            <View style={{ padding: 16, alignItems: 'center' }}>
                                <Button
                                    centered
                                    style={{backgroundColor: '#ddd', margin: 8 }}
                                    onPress={() => { this.props.getRankings() }}>Erneut laden</Button>
                            </View>
                        )
                    }
                    {
                        this.props.leagues.loading && (
                            <View style={{padding: 16}}>
                            <ActivityIndicator size='large' color="#666"/>
                                </View>)
                    }
                    { !this.props.leagues.loading && !this.props.leagues.error && this.renderLeagues() }
                    <ListItemDrawer.Separator />
                    { this._renderItem(SETTINGS, 'Einstellungen', 'settings') }
                </ScrollView>
            </View>
            );
    }
}

NavigationView.propTypes = {
    getRankings: React.PropTypes.func,
    onNavigate: React.PropTypes.func,
    leagues: React.PropTypes.object,
    width: React.PropTypes.number,
    settings: React.PropTypes.object
};

export default NavigationView;
