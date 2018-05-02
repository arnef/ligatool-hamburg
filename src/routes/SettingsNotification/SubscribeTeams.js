import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ListItem,
  Separator,
  TeamLogo,
  Switch,
  Content,
} from '../../components';
import {
  notificationSubscribedForTeam,
  subscribeTeam,
  unsubscribeTeam,
} from '../../redux/modules/settings';
import { getNavigationStateParams } from '../../redux/modules/navigation';
class SubscribeTeam extends Component {
  toggleNotification = team => {
    if (team.subscribed) {
      this.props.unsubscribeTeam(team);
    } else {
      this.props.subscribeTeam(team);
    }
  };

  renderRow = ({ item }) => {
    return (
      <ListItem style={{ flex: 1 }}>
        <TeamLogo team={item.emblemUrl} />
        <Switch
          title={item.name}
          value={item.subscribed}
          onValueChange={() => this.toggleNotification(item)}
        />
      </ListItem>
    );
  };

  render() {
    const { teams } = this.props;
    return (
      <Content
        data={teams}
        renderItem={this.renderRow}
        renderSeparator={Separator}
      />
    );
  }
}

const mapSubscribedTeams = (state, props) => {
  const teams = state.drawer[
    getNavigationStateParams(props.navigation).competitionId
  ]
    ? state.drawer[getNavigationStateParams(props.navigation).competitionId]
        .teams
    : [];
  const mapedTeams = [];
  for (let team of teams) {
    const subscribed = notificationSubscribedForTeam(state, team);
    mapedTeams.push({
      ...team,
      subscribed,
    });
  }
  return mapedTeams;
};

export default connect(
  (state, props) => ({
    teams: mapSubscribedTeams(state, props),
  }),
  dispatch => ({
    subscribeTeam: team => dispatch(subscribeTeam(team)),
    unsubscribeTeam: team => dispatch(unsubscribeTeam(team)),
  }),
)(SubscribeTeam);
