import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import { Container } from '../../components';
import { ListItem, Text, Switch, Separator } from '../../components/base';

class SettingsNotificationView extends Component {
  componentWillUnmount() {
    if (this.props.settings.changed) {
      this.props.saveNotifications();
    }
  }

  // render() {
  //   const leagues = Object.values(this.props.leagues);
  //   leagues.sort((a, b) => (a.name < b.name ? -1 : 1));
  //   return (
  //     <Container {...this.props}>
  //       <ListItem.Group>
  //         {leagues.map((league, idx) => {
  //           return this.renderRow(league, idx);
  //         })}
  //       </ListItem.Group>
  //     </Container>
  //   );
  // }
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
      <ListItem
        key={item.id}
        onPress={
          Platform.OS === 'android'
            ? () => {
                this.props.setGroupNotification(item.id, !checked);
              }
            : null
        }
      >
        <Text>{item.name}</Text>
        <View style={{ flex: 1 }} />
        <Switch
          value={checked}
          onValueChange={newValue => {
            this.props.setGroupNotification(item.id, newValue);
          }}
        />
      </ListItem>
    );
  }
}

export default connect(
  state => ({
    leagues: Object.values(state.leagues).sort(
      (a, b) => (a.name < b.name ? -1 : 1),
    ),
    settings: state.settings,
  }),
  dispatch => ({
    saveNotifications: () => dispatch(actions.saveNotifications()),
    setGroupNotification: (key, value) =>
      dispatch(actions.setGroupNotification(key, value)),
  }),
)(SettingsNotificationView);
