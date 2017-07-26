// @flow
import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { connect } from 'react-redux';
import * as SettingsActions from '../../redux/modules/settings';
import { Container, ListItem, Text, Switch, Separator } from '../../components';

class SettingsNotificationView extends Component {
  render() {
    return (
      <Container
        dataSource={this.props.leagues}
        renderRow={this.renderRow.bind(this)}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={Separator}
      />
    );
  }

  renderRow({ item }) {
    const groups = this.props.settings.notification.leagues || {};
    const checked = groups[item.id];

    return (
      <ListItem key={item.id}>
        <Switch
          title={item.name}
          value={checked}
          onValueChange={() => {
            this.props.setGroupNotification(item.id);
          }}
        />
      </ListItem>
    );
  }
}

export default connect(
  state => ({
    leagues: Object.values(state.drawer).sort(
      (a, b) => (a.name < b.name ? -1 : 1),
    ),
    settings: state.settings,
  }),
  dispatch => ({
    setGroupNotification: (key: number | string) =>
      dispatch(SettingsActions.toggleGroupNotification(key)),
  }),
)(SettingsNotificationView);
