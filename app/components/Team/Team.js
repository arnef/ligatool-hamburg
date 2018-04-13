import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Container, Separator, ListItem, Text } from '../../components';
import * as TeamsActions from '../../redux/modules/teams';
import {
  navigate,
  getNavigationStateParams,
} from '../../redux/modules/navigation';
import S from '../../lib/strings';
import TeamInfo from './TeamInfo';
import TeamVenue from './TeamVenue';
import TeamContact from './TeamContact';
import { getActiveTeam, getColor } from '../../redux/modules/user';
import Routes from '../../config/routes';

function Team(props) {
  const teamId = getNavigationStateParams(props.navigation)
    ? getNavigationStateParams(props.navigation).team.id
    : props.myTeamId;
  const team = props.teams[teamId];

  return (
    <Container
      error={props.error}
      refreshing={props.loading}
      onRefresh={() => props.getTeam(teamId)}
    >
      {team && (
        <View>
          <TeamInfo team={team} />
          <Separator group />
          {team.venue && <TeamVenue venue={team.venue} color={props.color} />}
          {team.venue && <Separator group />}
          {team.contact && (
            <TeamContact color={props.color} contacts={team.contact} />
          )}
          {team.contact && <Separator group />}
          {team.player.length > 0 && (
            <ListItem.Group>
              <ListItem.Header title={S.PLAYER} />
              {team.player.map((player, index) => (
                <View key={`player-${player.id}`}>
                  <ListItem
                    onPress={() => props.navigate(Routes.PLAYER, player)}
                  >
                    <ListItem.Image url={player.image} />
                    <Text>{`${player.name} ${player.surname}`}</Text>
                  </ListItem>
                  {index < team.player.length - 1 && <Separator image />}
                </View>
              ))}
            </ListItem.Group>
          )}
          {team.player.length > 0 && <Separator group />}
        </View>
      )}
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
    navigate: (routeName, params) => dispatch(navigate({ routeName, params })),
  }),
)(Team);
