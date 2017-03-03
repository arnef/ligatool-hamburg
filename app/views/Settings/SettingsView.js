import React, { Component } from 'react';
import {
	View,
} from 'react-native';
import { connect } from 'react-redux';
import codePush from 'react-native-code-push';
import { ListItemGroup, ListItem, ListItemSwitch } from '../../components/List';
import { Container, Text } from '../../components';
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
				<ListItemSwitch disabled={disabled}
						value={value}			
						onValueChange={(newValue) => {
								this._toggleNotification(key, newValue);
							}} >
					{ text }
				</ListItemSwitch>);
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
		<ListItemGroup name='Benachrichtigungen'>	
			{ this._renderCheckbox('Benachrichtigungen', notification.on, 'on') }
			<ListItem.Separator />	
			{ this._renderCheckbox('Live-Zwischenergebnis', notification.live, 'live', !notification.on) }
			<ListItem.Separator />
			{ this._renderCheckbox('Endstand', notification.ended, 'ended', !notification.on) }
			<ListItem.Separator />
			<ListItem
				disabled={!notification.on || this.props.leagues.data.length === 0}
				onPress={this._toggleGroups.bind(this)}>
				Gruppen wählen
			</ListItem>
		</ListItemGroup>);
	}

	render() {
		const team = this.props.settings.team;
		return (
			<Container>		
				<ListItemGroup name='Benutzerdaten'>
				{ team && (
					<View>
						<ListItem image={ team.image } icon={team.image ? null: 'shirt'}>
							<Text>{ team.name }</Text>
						</ListItem>
						
						<ListItem.Separator icon />
						<ListItem onPress={this._logout.bind(this)}
							icon='log-out'><Text>Logout</Text>
						</ListItem>
					</View>
				)}
				{ !team && (
					<ListItem onPress={this._login.bind(this)}
						icon='log-in'>
						Team wählen
					</ListItem>
				)}
				</ListItemGroup>
				
				{ this._renderSectionNotification() }

				<ListItemGroup name='Informationen'>				
					<ListItem icon='information-circle' onPress={this._checkForUpdate.bind(this)}>
						<Text>App-Version { !!this.state.pkg ? `${this.state.pkg.appVersion} (${this.state.pkg.label})`: '0.9' }</Text>
					</ListItem>
				</ListItemGroup>
			
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
