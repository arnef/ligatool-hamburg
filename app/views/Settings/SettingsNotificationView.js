import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { ListItemSwitch, ListItemGroup } from '../../components/List';
import { Container } from '../../components';

class SettingsNotificationView extends Component {

    componentWillUnmount() {
        if (this.props.settings.changed) {
            console.tron.log('save group settings');
            this.props.saveNotifications();
        }
    }

    render() {
        const leagues = this.props.leagues.data;
        return (
            <Container {...this.props}>
                <ListItemGroup>
                { leagues.map( (league, idx) => {
                    return this.renderRow(league, idx);
                })}
                </ListItemGroup>
            </Container>
        );
    }

    renderRow(data, idx) {
        const groups = this.props.settings.notification.leagues || {};
        const checked = groups[data.id];
        return (
            <View key={data.id}>
            <ListItemSwitch
                last={idx === this.props.leagues.data.length -1}         
                value={checked}
                onValueChange={(newValue) => { 
                    this.props.setGroupNotification(data.id, newValue)
                }}>
                { data.name }
            </ListItemSwitch>
            </View>
        );
    }
}

SettingsNotificationView.propTypes = {
    setGroupNotification: React.PropTypes.func,
    saveNotifications: React.PropTypes.func,
    settings: React.PropTypes.object,
    leagues: React.PropTypes.object
};


export default connect( state => ({ settings: state.settings, leagues: state.leagues }))(SettingsNotificationView);