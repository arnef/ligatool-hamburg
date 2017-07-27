// @flow
import React from 'react';
import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import { Container, ListItem, Switch, Separator } from '../../components';
import * as SettingsActions from '../../redux/modules/settings';

class SettingsNotification extends React.Component {
  renderItem: Function;

  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem({ item }) {
    const groups = this.props.notifications.leagues || {};

    return (
      <ListItem>
        <Switch
          title={item.name}
          value={groups[`${item.id}`]}
          onValueChange={() => this.props.toggleNotification(item.id)}
        />
      </ListItem>
    );
  }

  render() {
    return (
      <Container
        dataSource={this.props.leagues}
        renderRow={this.renderItem}
        keyExtractor={item => `${item.id}`}
        ItemSeparatorComponent={Separator}
      />
    );
  }
}

export default connect(
  state => ({
    leagues: sortBy(state.drawer, 'name'),
    notifications: state.settings.notification,
  }),
  (dispatch: Dispatch<any>) => ({
    toggleNotification: key =>
      dispatch(SettingsActions.toggleGroupNotification(key)),
  }),
)(SettingsNotification);
