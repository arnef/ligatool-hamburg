import React, { Component } from 'react';
import { View } from 'react-native';
import { sortBy } from 'lodash';
import {
  Container,
  TeamLogo,
  ListItem,
  Text,
  Separator,
} from '../../components';
import { connect } from 'react-redux';
import * as LeaguesActions from '../../redux/modules/leagues';
import { NavigationActions } from 'react-navigation';

class SelectTeamView extends Component {
  render() {
    const { teams } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <Container
          dataSource={teams}
          renderRow={this.renderItem}
          getItemLayout={(data, index) => ({
            length: ListItem.ITEM_HEIGHT,
            offset: ListItem.ITEM_HEIGHT * index,
            index,
          })}
          ItemSeparatorComponent={() => <Separator image />}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }

  renderItem = ({ item }) => {
    return (
      <ListItem onPress={() => this.onPress(item)}>
        <TeamLogo team={item.emblemUrl} />
        <Text>{`${item.name}`}</Text>
      </ListItem>
    );
  };

  onPress = team => {
    this.props.setUserTeam(team);
  };
}

export default connect(
  (state, props) => {
    return {
      error: state.loading.error,
      fetching: state.loading.list,
      teams: sortBy(
        state.drawer[props.navigation.state.params.id]
          ? state.drawer[props.navigation.state.params.id].teams
          : [],
        'name',
      ),
    };
  },
  dispatch => ({
    getLeague: id => dispatch(LeaguesActions.getLeague(id)),
    setUserTeam: team =>
      dispatch({ type: 'SELECT_USER_TEAM', payload: { id: team.id } }),
    navigate: route => dispatch(NavigationActions.navigate(route)),
  }),
)(SelectTeamView);
