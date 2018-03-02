import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Container, Separator, ListItem, Text } from '../../components';
import * as TeamsActions from '../../redux/modules/teams';
import * as NavigationActions from '../../redux/modules/navigation';
import S from '../../lib/strings';
import TeamInfo from './TeamInfo';
import TeamVenue from './TeamVenue';
import TeamContact from './TeamContact';
import { getActiveTeam, getColor } from '../../redux/modules/user';

function Team(props) {
  const teamId = props.navigation.state.params
    ? props.navigation.state.params.team.id
    : props.myTeamId;
  const team = props.teams[teamId];

  return (
    <Container
      error={props.error}
      refreshing={props.loading}
      onRefresh={() => props.getTeam(teamId)}
    >
      {team &&
        <View>
          <TeamInfo team={team} />
          <Separator group />
          <TeamVenue venue={team.venue} color={props.color} />
          <Separator group />
          {team.contact &&
            <TeamContact color={props.color} contacts={team.contact} />}
          {team.contact && <Separator group />}
          <ListItem.Group>
            <ListItem.Header title={S.PLAYER} />
            {team.player.map((player, index) =>
              <View key={`player-${player.id}`}>
                <ListItem
                // onPress={() => props.navigate(Routes.PLAYER, player)}
                >
                  <ListItem.Image url={player.image} />
                  <Text>{`${player.name} ${player.surname}`}</Text>
                </ListItem>
                {index < team.player.length - 1 && <Separator image />}
              </View>,
            )}
          </ListItem.Group>
          <Separator group />
        </View>}
    </Container>
  );
}

export default connect(
  state => ({
    teams: state.teams,
    error: state.loading.error,
    loading: state.loading.list,
    color: getColor(state),
    myTeamId: getActiveTeam(state) ? getActiveTeam(state).id : null,
  }),
  dispatch => ({
    getTeam: id => dispatch(TeamsActions.getTeam(id)),
    navigate: (routeName, params) =>
      dispatch(NavigationActions.navigate({ routeName, params })),
  }),
)(Team);
