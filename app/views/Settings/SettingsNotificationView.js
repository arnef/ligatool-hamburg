import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import { Container } from '../../components';
import { ListItem, Text, Switch } from '../../components/base';

class SettingsNotificationView extends Component {
  componentWillUnmount() {
    if (this.props.settings.changed) {
      this.props.saveNotifications();
    }
  }

  render() {
    const leagues = Object.values(this.props.leagues);
    leagues.sort((a, b) => (a.name < b.name ? -1 : 1));
    return (
      <Container {...this.props}>
        <ListItem.Group>
          {leagues.map((league, idx) => {
            return this.renderRow(league, idx);
          })}
        </ListItem.Group>
      </Container>
    );
  }

  renderRow(data, idx) {
    const groups = this.props.settings.notification.leagues || {};
    const checked = groups[data.id];

    return (
      <ListItem
        key={data.id}
        last={idx === Object.keys(this.props.leagues).length - 1}
        onPress={
          Platform.OS === 'android'
            ? () => {
                this.props.setGroupNotification(data.id, !checked);
              }
            : null
        }
      >
        <Text>{data.name}</Text>
        <View style={{ flex: 1 }} />
        <Switch
          value={checked}
          onValueChange={newValue => {
            this.props.setGroupNotification(data.id, newValue);
          }}
        />
      </ListItem>
    );
  }
}

export default connect(
  state => ({
    leagues: state.leagues,
    settings: state.settings
  }),
  dispatch => ({
    saveNotifications: () => dispatch(actions.saveNotifications()),
    setGroupNotification: (key, value) =>
      dispatch(actions.setGroupNotification(key, value))
  })
)(SettingsNotificationView);
