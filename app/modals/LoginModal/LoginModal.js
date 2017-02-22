import React, { Component } from 'react';
import { Modal, TextInput, ActivityIndicator, Dimensions, View } from 'react-native';
import Button from '../../components/Button';
import { ListItem, ListItemGroup } from '../../components/List';
import Toolbar from '../../components/Toolbar';
import Container from '../../components/Container';
import { Row, Column, Text } from '../../components/Styles';
import Navigator from '../../Navigation';

import SelectGroupView from './SelectGroupView';
import SelectTeamView from './SelectTeamView';
import LoginView from './LoginView';

export const ROUTE_SELECT_GROUP = 'ROUTE.SELECT_GROUP';
export const ROUTE_SELECT_TEAM = 'ROUTE.SELECT_TEAM';
export const ROUTE_LOGIN = 'ROUTE.LOGIN';

class LoginModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openLeague: null,
            showPassword: false,
            user: '',
            pass: ''
        };
    }

    

    _onRequestClose() {
        this.props.showLogin(false);

    }

    _login() {
        // if (this.state.user !== '' && this.state.pass !== '') {
        //     const loginUser = {
        //         username: this.state.user,
        //         password: this.state.pass
        //     };
        //     this.props.requestAPIKey(loginUser);
        // }
    }

    _onShow() {
        // if (this.props.leagues.data.length === 0) {
        //     this.props.getRankings();
        // }
    }

    render() {
        return (
            <Modal
                animationType='slide'
                onShow={this._onShow.bind(this)}
                onRequestClose={this._onRequestClose.bind(this)}
                visible={this.props.dialog.login.visible}
                >
                <Navigator
                    { ...this.props }
                    closeModal={this._onRequestClose.bind(this)}
                    initialRoute={{ state: ROUTE_SELECT_GROUP, title: 'Gruppe wählen'}}
                    renderScene={this.renderScene.bind(this)}
                    />
            </Modal>
        )
    }

    renderScene(route, navigator) {
        console.tron.log(route);
        switch (route.state) {
            case ROUTE_SELECT_GROUP:
                console.tron.log(ROUTE_SELECT_GROUP);
                return (<SelectGroupView { ...this.props } navigator={navigator} />);
            case ROUTE_SELECT_TEAM:
                return (<SelectTeamView { ...this.props } navigator={navigator} id={route.id} />);
            case ROUTE_LOGIN:
                return (<LoginView { ...this.props } navigator={navigator} />);
        }
    }

    renderOLD() {
        const title = this.props.settings.team ? this.props.settings.team.name : 'Wähle dein Team';

        const error = this.props.auth.error || this.props.leagues.error || this.props.league.error;
        console.tron.log(error);
        return (
            <Modal
                animationType='slide'
                onShow={this._onShow.bind(this)}
                onRequestClose={ () => {
                    console.tron.log('REQEUST CLOSE');
                    this._onRequestClose();
                }}
                visible={this.props.dialog.login.visible}>
                <Toolbar 
                    navIconName='close'
                    title={title}
                    onIconClicked={ () => { this._onRequestClose() }}
                />
                <Container error={error}>
                    { !this.props.settings.team && this.renderLeagues() }
                    { !!this.props.settings.team &&  this.renderLogin() }
                </Container>
            </Modal>
        );
    }


    renderLeagues() {        
        return (
        <ListItemGroup> 
            { this.props.leagues.data.map( (league, idx) => {
                if (!league.cup) {
                    const showTeams = league.id === this.state.openLeague;
                    return (
                        <View key={idx}>
                            <ListItem 
                                onPress={() => { this.onPressLeague(league.id)}}>
                                {league.name}
                            </ListItem>
                            { !!showTeams && (
                               <ListItemGroup>
                                { this.renderTeams(league.id) }
                                </ListItemGroup>
                            ) }
                            <ListItem.Separator />
                        </View>
                    );
                }
            })} 
        </ListItemGroup>);
    }

    renderTeams(leagueID) {
        const league = this.props.league.id[leagueID] || { id: -1, table: []};
        if (this.props.league.loading) {
            return (
                <Row center style={{height: 60}}>
                    <Column center>
                        <ActivityIndicator color={this.props.settings.color} size='large' />
                    </Column>
                </Row>);
        } else {
            return league.table.map( (team, idx) => {
                return (
                    <View key={team.id} >
                        <ListItem 
                            onPress={() => { this.onPressTeam(team)}}
                            image={team.image} icon={!team.image ? 'shirt':null}>
                            { team.name }
                        </ListItem>
                        { idx < league.table.length-1 && (
                            <ListItem.Separator icon />
                        )}
                    </View>
                )
            });
        }
    }

    renderLogin() {
        if (this.props.auth.loading) {
            return (
                <Row center style={{height: Dimensions.get('window').height - 120}}>
                    <Column center>
                        <ActivityIndicator color={this.props.settings.color} size='large' />
                    </Column>
                </Row>
            )
        }
        return (
            <ListItemGroup>
                <Row style={{padding: 8}}>
                    <Column>
                        <Text>Zugangsdaten für das Liga-Tool.</Text>
                        <Text>Wenn diese nicht eingetragen werden, können keine Spiele eingetragen werden.</Text>
                    </Column>
                </Row>
                <Row style={{padding: 8}}>
                    <Column>
                        <TextInput placeholder='Username'
                            ref='UserInput'
                            autoFocus
                            
                            style={{height: 40, marginVertical: 8}}
                            editable={!this.props.auth.loading}
                            blurOnSubmit={false}                        
                            autoCorrect={false}
                            onChangeText={(text) => {
                                this.setState({ user: text });
                            }}
                            onSubmitEditing={ () => {
                                this.refs.PassInput.focus()
                            }}
                            returnKeyLabel='next' />
                        <TextInput placeholder='Passwort'
                            ref='PassInput'      
                            style={{height: 40, marginVertical: 8}}                      
                            editable={!this.props.auth.loading}
                            secureTextEntry={true}
                            onChangeText={(text) => {
                                this.setState({ pass: text })
                            }}
                            returnKeyType='send' />
                    </Column>
                </Row>
                <Row style={{ padding: 4}}>
                    <Column>
                        <Button block 
                            onPress={this._onRequestClose.bind(this)}>
                            Überspringen
                        </Button>
                    </Column>
                    <Column>
                        <Button primary block 
                            disabled={!this.state.user && !this.state.pass}
                            onPress={this._login.bind(this)}>
                            Login
                        </Button>
                    </Column>
                </Row>
            </ListItemGroup>
        );
    }    

    onPressLeague(id) {
        if (!this.props.league.id[id]) {
            this.props.getLeague(id);
        }
        if (id === this.state.openLeague) {
            this.setState({ openLeague: null });
        } else {
            this.setState({ openLeague: id });
        }
    }

    onPressTeam(team) {
        this.setState({ openLeague: null });
        this.props.setUserTeam(team);
    }
}


LoginModal.propTypes = {
    setUserTeam: React.PropTypes.func,
    getLeague: React.PropTypes.func,
    showLogin: React.PropTypes.func,
    requestAPIKey: React.PropTypes.func,
    getRankings: React.PropTypes.func,
    leagues: React.PropTypes.object,
    league: React.PropTypes.object,
    auth: React.PropTypes.object,
    settings: React.PropTypes.object,
    dialog: React.PropTypes.object    
};

export default LoginModal;