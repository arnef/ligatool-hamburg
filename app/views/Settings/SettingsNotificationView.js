import React, { Component } from 'react'
import { View, Switch, Platform } from 'react-native'
import { connect } from 'react-redux'
import { Container } from '../../components'
import { ListItem, Text } from '../../components/base'

class SettingsNotificationView extends Component {

    componentWillUnmount() {
        if (this.props.settings.changed) {
            console.tron.log('save group settings')
            this.props.saveNotifications()
        }
    }

    render() {
        const leagues = this.props.leagues.data

        return (
            <Container {...this.props}>
                <ListItem.Group>
                { leagues.map( (league, idx) => {
                    return this.renderRow(league, idx)
                })}
                </ListItem.Group>
            </Container>
        )
    }

    renderRow(data, idx) {
        const groups = this.props.settings.notification.leagues || {}
        const checked = groups[data.id]

        return (
            <ListItem key={data.id}
                last={idx === this.props.leagues.data.length -1}         
                onPress={Platform.OS === 'android' ? () => { 
                    this.props.setGroupNotification(data.id, !checked)
                } : null}>
                <Text>{ data.name }</Text>
                <View style={{ flex: 1 }} />
                <Switch value={checked} onValueChange={(newValue) => {
                    this.props.setGroupNotification(data.id, newValue)
                }} />
            </ListItem>
        )
    }
}

SettingsNotificationView.propTypes = {
    leagues: React.PropTypes.object,
    saveNotifications: React.PropTypes.func,
    setGroupNotification: React.PropTypes.func,
    settings: React.PropTypes.object    
}


export default connect( state => ({ 
    leagues: state.leagues,
    settings: state.settings
}))(SettingsNotificationView)