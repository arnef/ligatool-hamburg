import React from 'react';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import * as LeaguesActions from '../../redux/modules/leagues';
import { ListItem, Text, Separator, Content } from '../../components';
import { sortCompetition } from '../../Helper';

class SelectGroupView extends React.Component {
  render() {
    return (
      <Content
        onRefresh={this.props.getRankings}
        renderItem={this.renderItem}
        renderSeparator={Separator}
        data={this.props.leagues}
      />
    );
  }

  renderItem = ({ item }) => {
    return (
      <ListItem onPress={() => this.onPress(item)}>
        <Text>{`${item.name}`}</Text>
      </ListItem>
    );
  };

  onPress(league) {
    this.props.navigate({
      routeName: 'SelectTeam',
      params: {
        id: league.id,
      },
    });
  }
}

export default connect(
  state => ({
    leagues: sortBy(state.drawer, sortCompetition),
  }),
  dispatch => ({
    getRankings: () => dispatch(LeaguesActions.getLeagues()),
    navigate: route => dispatch(NavigationActions.navigate(route)),
  }),
)(SelectGroupView);
