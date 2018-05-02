import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, ListItem, Separator, Content } from '../../components';
import { sortCompetition } from '../../Helper';
import { sortBy } from 'lodash';
import { navigate } from '../../redux/modules/navigation';
import Routes from '../../config/routes';

class SettingsNotification extends Component {
  renderRow = ({ item }) => {
    const { openCompetition } = this.props;
    return (
      <ListItem onPress={() => openCompetition(item.id)}>
        <Text style={{ flex: 1 }}>{`${item.name}`}</Text>
        <ListItem.Icon right name="caret-forward" />
      </ListItem>
    );
  };

  render() {
    const { competitions } = this.props;
    return (
      <Content
        data={competitions}
        renderItem={this.renderRow}
        renderSeparator={Separator}
      />
    );
  }
}

export default connect(
  state => ({
    competitions: sortBy(state.drawer, sortCompetition),
  }),
  dispatch => ({
    openCompetition: competitionId =>
      dispatch(
        navigate({
          routeName: Routes.SETTINGS_NOTIFICATIONS_TEAMS,
          params: { competitionId },
        }),
      ),
  }),
)(SettingsNotification);
