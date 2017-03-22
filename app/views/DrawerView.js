import React, { Component, PropTypes } from 'react'
import { View, ScrollView, ActivityIndicator } from 'react-native'
import { Button, Image, ListItem, Text } from '../components/base'
import * as theme from '../components/base/theme'
import { RANKING, LEAGUE_MATCHES, OVERVIEW, MY_TEAM, SETTINGS } from '../views/routes'

class NavigationView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            activeLeague: -1,
            activePage: OVERVIEW
        }
    }

    componentDidMount() {
        this.props.getRankings()
    }

    _handleRowPress(state) {
        if (state.title === 'Login') {
            state.title = null
        }
        if (this.props.onNavigate) {
            this.props.onNavigate(state)
        }
        this.setState({
            activeLeague: state.leagueID ? state.leagueID : -1,
            activePage: state.state
        })
    }

    _renderItem(state, text, icon) {
        const active = this.state.activePage === state
        const color = this.props.settings.color
        
        return (
            <ListItem 
                active={active}
                onPress={() => { this._handleRowPress({ state: state, title: text } ) }}
                last>
                <ListItem.Icon color={active ? color : theme.secondaryTextColor} name={icon} />
                <Text bold color={active ? color : null}>{ text }</Text>
            </ListItem>
        )
    }

    renderLeagues() {
        const color = this.props.settings.color

        return this.props.leagues.data.map( (league) => {
                const active = league.id === this.state.activeLeague

                return (
                    <ListItem key={league.id}
                        last
                        active={active}
                        onPress={ () => {
                            this._handleRowPress({ leagueID: league.id, state: league.cup ? LEAGUE_MATCHES : RANKING, title: league.name })
                        }}>
                        <Text bold color={active ? color : null}>
                        { league.name }
                        </Text>
                    </ListItem>
                )
        })
    }

    render() {
        const height = Math.floor(this.props.width * 0.625)
        const team = this.props.settings.team || null

        return (
            <View style={{ flex: 1 }}>
            <View style={{ height: height, overflow: 'hidden', width: this.props.width }}>
                <Image
                    style={{ height: height, resizeMode: 'cover', width: this.props.width }}
                    source={{ uri : team ? 'turm_bw' : 'turm' }} />
                    { team && (
                    <View style={{ flexDirection: 'row', position: 'absolute', top: height-66, alignItems: 'center', width: this.props.width, height: 60 }}>
                        { team.image && (
                            <Image url={team.image}  style={{ width: 60, height: 60, marginLeft: 8}} />
                        )}
                        <Text color='#fff' size={24} style={{marginLeft: 16, flex: 1 }}>
                            { team.name }
                        </Text>
                    </View>
                    )}
                </View>
                <ScrollView style={{flex: 1}}>
                    <View style={{ height: 5, flex: 1 }} />
                    { this._renderItem(OVERVIEW, 'Übersicht', 'football') }
                    { this._renderItem(MY_TEAM, team ? 'Mein Team': 'Team wählen', team ? 'shirt': 'log-in')}
                    { this.renderSeparator() }
                    {!this.props.leagues.loading && (this.props.leagues.error || this.props.leagues.data.length === 0)  && (
                            <View style={{ padding: 16, alignItems: 'center' }}>
                                <Button
                                    centered
                                    style={{backgroundColor: '#ddd', margin: 8 }}
                                    onPress={() => { this.props.getRankings() }}>Erneut laden</Button>
                            </View>
                        )}
                    {
                        this.props.leagues.loading && (
                            <View style={{padding: 16}}>
                            <ActivityIndicator size='large' color="#666"/>
                                </View>)
                    }
                    { !this.props.leagues.loading && !this.props.leagues.error && this.renderLeagues() }
                    { this.renderSeparator() }
                    { this._renderItem(SETTINGS, 'Einstellungen', 'settings') }
                    <View style={{ height: 5, flex: 1 }} />
                </ScrollView>
            </View>
            )
    }

    renderSeparator() {
        return (<View style={{flex: 1, height: 1, backgroundColor: '#eee', marginVertical: 4}} />)
    }
}

NavigationView.propTypes = {
    getRankings: PropTypes.func,
    onNavigate: PropTypes.func,
    leagues: PropTypes.object,
    width: PropTypes.number,
    settings: PropTypes.object
}

export default NavigationView
