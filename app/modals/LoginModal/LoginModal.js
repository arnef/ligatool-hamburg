import React, { Component } from 'react';
import { Modal } from 'react-native';
import Navigator from '../../Navigation';
import SelectGroupView from './SelectGroupView';
import SelectTeamView from './SelectTeamView';
import LoginView from './LoginView';

export const ROUTE_SELECT_GROUP = 'ROUTE.SELECT_GROUP';
export const ROUTE_SELECT_TEAM = 'ROUTE.SELECT_TEAM';
export const ROUTE_LOGIN = 'ROUTE.LOGIN';

class LoginModal extends Component {

    _onRequestClose() {
        this.props.showLogin(false);
    }

    render() {
        return (
            <Modal
                animationType='slide'
                onRequestClose={this._onRequestClose.bind(this)}
                visible={this.props.dialog.login.visible}>
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