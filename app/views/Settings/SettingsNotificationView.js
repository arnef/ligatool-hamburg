import React, { Component } from 'react';
import { View, Switch, Platform } from 'react-native';
import { connect } from 'react-redux';
import { ListItemGroup } from '../../components/List';
import { Container } from '../../components';
import { ListItem, Text } from '../../ui';

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
            <ListItem key={data.id}
                last={idx === this.props.leagues.data.length -1}         
                onPress={Platform.OS === 'android' ? (newValue) => { 
                    this.props.setGroupNotification(data.id, newValue)
                } : null}>
                <Text>{ data.name }</Text>
                <View style={{ flex: 1 }} />
                <Switch value={checked} onValueChange={(newValue) => {
                    this.props.setGroupNotification(data.id, newValue)
                }} />
            </ListItem>
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