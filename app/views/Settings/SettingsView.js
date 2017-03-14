import React, { Component } from 'react';
import {
	View, Switch, Platform
} from 'react-native';
import { connect } from 'react-redux';
import codePush from 'react-native-code-push';
import { ListItem, Text } from '../../ui';
import { Container } from '../../components';
import { SETTINGS_NOTIFICATION } from '../routes';
class SettingsView extends Component {

	constructor(props) {
		super(props);
		this.state = {
			pkg: null
		};
	}


	_logout() {
		this.props.logout();
	}

	_login() {
		this.props.showLogin(true);
	}

	componentDidMount() {
		codePush.getUpdateMetadata().then(pkg => {
			this.setState({ pkg: pkg });
		});
		if (this.props.leagues.data.length === 0) {
			this.props.getRankings();
		}
	}

	componentWillUnmount() {
        if (this.props.settings.changed) {
            console.tron.log('save group settings');
            this.props.saveNotifications();
        }
    }

	_toggleNotification(key, value) {
		console.tron.log(key + ' => ' + value);
		this.props.setNotification(key, value);
	}

	_renderCheckbox(text, value, key, disabled) {
			return (
				<ListItem 
					disabled={disabled}		
					onPress={Platform.OS === 'android' ? () => {
						this._toggleNotification(key, !value);
					} : null} >
					<Text>{ text }</Text>
					<View style={{flex: 1}} />
					<Switch value={value} onValueChange={(newValue) => this._toggleNotification(key, newValue)} />
				</ListItem>);
	}

	_toggleGroups() {
		if (this.props.navigator) {
			console.tron.log('open group view');
			this.props.navigator.push({
				state: SETTINGS_NOTIFICATION,
				title: 'Gruppen wählen'
			});
		}
	}

	_renderSectionNotification() {
		const notification = this.props.settings.notification;
		return (
		<ListItem.Group>
			<ListItem.Header title='Benachrichtigungen' />	
			{ this._renderCheckbox('Benachrichtigungen', notification.on, 'on') }
			{ this._renderCheckbox('Live-Zwischenergebnis', notification.live, 'live', !notification.on) }
			{ this._renderCheckbox('Endstand', notification.ended, 'ended', !notification.on) }
			<ListItem last
				disabled={!notification.on || this.props.leagues.data.length === 0}
				onPress={this._toggleGroups.bind(this)}>
				<Text>Gruppen wählen</Text>
				<View style={{flex:1}} />
				{ Platform.OS === 'ios' && (<ListItem.Icon name='caret-forward' right />) }
			</ListItem>
		</ListItem.Group>);
	}

	render() {
		const team = this.props.settings.team;
		return (
			<Container {...this.props}>	
				<ListItem.Group>
					<ListItem.Header title='Benutzerdaten' />
				{ team && (
					<View>
						<ListItem icon>
							{ !!team.image && (<ListItem.Image url={team.image} />)}
							{ !team.image && (<ListItem.Icon name='shirt' color={this.props.settings.color} />)}
							<Text>{ team.name }</Text>
						</ListItem>
						{ !this.props.auth.api_key && (
							<ListItem icon onPress={this._login.bind(this)}>
								<ListItem.Icon name='key' color={this.props.settings.color} />
									<Text>Zugangsdaten eingeben</Text>
							</ListItem>
						)}
						<ListItem last onPress={this._logout.bind(this)}>
							<ListItem.Icon name='log-out' color={this.props.settings.color} />
							<Text>Abmelden</Text>
						</ListItem>
					</View>
				)}
				{ !team && (
					<ListItem last onPress={this._login.bind(this)}>
						<ListItem.Icon name='log-in' color={this.props.settings.color} />
						<Text>Team wählen</Text>
					</ListItem>
				)}
				</ListItem.Group>
				
				{ this._renderSectionNotification() }

				<ListItem.Group>				
					<ListItem.Header title='Informationen' />
					<ListItem last onPress={Platform.OS === 'android' ? this._checkForUpdate.bind(this) : null}>
						<ListItem.Icon name='information-circle' color={this.props.settings.color} />
						<Text>App-Version { !!this.state.pkg ? `${this.state.pkg.appVersion} (${this.state.pkg.label})`: '0.9' }</Text>
					</ListItem>
				</ListItem.Group>
			</Container>
		);
	}
	_checkForUpdate() {
		console.tron.log('check for update');
		codePush.sync({ updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE });
	}
}

SettingsView.propTypes = {
	showLogin: React.PropTypes.func,
	logout: React.PropTypes.func,
	setNotification: React.PropTypes.func,
	saveNotifications: React.PropTypes.func,
	user: React.PropTypes.object,
	settings: React.PropTypes.object,
	leagues: React.PropTypes.object,
	navigator: React.PropTypes.object
};

export default connect((state) => ({
	settings: state.settings,
	dialog: state.dialog,
	leagues: state.leagues
}))(SettingsView);
