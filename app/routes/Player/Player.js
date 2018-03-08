import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import * as PlayerActions from '../../redux/modules/player';
import { DATE_FORMAT, WITH_DRAW } from '../../config/settings';
import {
  Container,
  MatchStatsBar,
  Text,
  Image,
  ListItem,
  Separator,
} from '../../components';
import S from '../../lib/strings';

class Player extends Component {
  constructor(props) {
    super(props);
    this.getPlayer = this.getPlayer.bind(this);
  }

  renderItem(name, value) {
    return (
      <ListItem multiline>
        <View>
          <Text bold>
            {name}
          </Text>
          <Text>
            {value ? value : '-'}
          </Text>
        </View>
      </ListItem>
    );
  }

  render() {
    const { loading, error } = this.props;
    const player = this.props.players[this.props.navigation.state.params.id];

    return (
      <Container refreshing={loading} error={error} onRefresh={this.getPlayer}>
        {player &&
          <View>
            {this.renderInformation(player)}
            <Separator group />
            {this.renderStats(player.statistics)}
            {this.renderRanglists(player.ranglists)}
            {this.renderTournaments(player.tournament_participations)}
            {this.renderTeams(player.teams)}
          </View>}
      </Container>
    );
  }

  renderInformation(player) {
    return (
      <ListItem.Group>
        <ListItem.Header title={S.PLAYER_INFO} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image url={player.image} height={240} width={180} />
          </View>
        </View>
        {this.renderItem(S.NAME, `${player.name} ${player.surname}`)}
        <Separator />
        {this.renderItem(S.CLASSIFICATION, player.classification)}
        <Separator />
        {this.renderItem(S.NATIONAL_NUMBER, player.number)}
        <Separator />
        {this.renderItem(S.INTERNATIONAL_NUMBER, player.international_number)}
        <Separator />
        {player.teams.length > 0 &&
          this.renderItem(S.TEAM, player.teams[0].name)}
        {player.teams.length > 0 && <Separator />}
        {this.renderItem(S.CLUB, player.club.name)}
        <Separator />
        {this.renderItem(S.ASSOCIATION, player.association.name, true)}
      </ListItem.Group>
    );
  }

  renderStats(stats) {
    if (stats.length > 0) {
      return stats.sort((a, b) => (a.name < b.name ? -1 : 1)).map((stat, idx) =>
        <View key={idx}>
          <ListItem.Group>
            <ListItem.Header title={`${S.STATISTIC} ${stat.name}`} />
            <ListItem multiline>
              <View style={{ flex: 2, alignItems: 'center' }}>
                <Text bold small numberOfLines={1}>
                  {S.POSITION}
                </Text>
              </View>
              <View style={{ flex: 2, alignItems: 'center' }}>
                <Text small numberOfLines={1}>
                  {S.GAMES}
                </Text>
              </View>
              <View style={{ flex: 3, alignItems: 'center' }}>
                <Text center small numberOfLines={1}>
                  {S.SET_POINTS_RATE}
                </Text>
              </View>
              <View style={{ flex: 3, alignItems: 'center' }}>
                <Text bold small numberOfLines={1}>
                  {S.COMPETITIVE_INDEX}
                </Text>
              </View>
            </ListItem>
            <Separator full />
            <ListItem multiline>
              <View style={{ flex: 2, alignItems: 'center' }}>
                <Text bold center>{`${stat.position}`}</Text>
              </View>
              <View style={{ flex: 2, alignItems: 'center' }}>
                <Text center>{`${stat.matches}`}</Text>
              </View>
              <View style={{ flex: 3, alignItems: 'center' }}>
                <Text center>{`${stat.rate}`}</Text>
              </View>
              <View style={{ flex: 3, alignItems: 'center' }}>
                <Text center bold>{`${stat.competitive_index}`}</Text>
              </View>
            </ListItem>
            <ListItem multiline>
              <View style={{ flex: 1 }}>
                <MatchStatsBar stats={stat} />
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{ flex: 1, fontSize: 10 }}
                  >{`${stat.wins} ${S.WIN}${stat.wins !== 1
                    ? S.WIN_POSTFIX
                    : ''}`}</Text>
                  {WITH_DRAW &&
                    <Text
                      style={{ flex: 1, fontSize: 10, textAlign: 'center' }}
                    >{`${stat.draws} ${S.DRAW}${stat.draws !== 1
                      ? S.DRAW_POSTFIX
                      : ''}`}</Text>}
                  <Text
                    style={{ flex: 1, fontSize: 10, textAlign: 'right' }}
                  >{`${stat.lost} ${S.LOST}${stat.lost !== 1
                    ? S.LOST_POSTFIX
                    : ''}`}</Text>
                </View>
              </View>
            </ListItem>
          </ListItem.Group>
          <Separator group />
        </View>,
      );
    }
    return <View />;
  }

  renderRanglists(ranglists) {
    if (ranglists.length > 0) {
      return (
        <View>
          <ListItem.Group>
            <ListItem.Header
              title={`Ranglistenplatzierungen ${ranglists[0].season}`}
            />
            <ListItem multiline>
              <View style={{ flex: 6 }}>
                <Text bold small numberOfLines={1}>
                  Rangliste
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text bold small numberOfLines={1}>
                  Platz
                </Text>
              </View>
              <View style={{ flex: 3, alignItems: 'center' }}>
                <Text bold small numberOfLines={1}>
                  Meldungen
                </Text>
              </View>
            </ListItem>
            <Separator full />
            {ranglists.map((ranglist, idx) => {
              return (
                <View key={ranglist.id}>
                  <ListItem multiline>
                    <View style={{ flex: 6 }}>
                      <Text>{`${ranglist.name}`}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Text>{`${ranglist.position}`}</Text>
                    </View>
                    <View style={{ flex: 3, alignItems: 'center' }}>
                      <Text>{`${ranglist.participants}`}</Text>
                    </View>
                  </ListItem>
                  {idx < ranglists.length - 1 && <Separator />}
                </View>
              );
            })}
          </ListItem.Group>
          <Separator group />
        </View>
      );
    } else {
      return <View />;
    }
  }

  renderTeams(teams) {
    if (teams.length > 0) {
      return (
        <View>
          <ListItem.Group>
            <ListItem.Header title="Teams" />
            <ListItem multiline>
              <View style={{ flex: 2 }}>
                <Text bold small numberOfLines={1}>
                  Saison
                </Text>
              </View>
              <View style={{ flex: 4 }}>
                <Text bold small numberOfLines={1}>
                  Name
                </Text>
              </View>
              <View style={{ flex: 4 }}>
                <Text bold small numberOfLines={1}>
                  Wettbewerbe
                </Text>
              </View>
            </ListItem>
            <Separator full />
            {teams.map((team, idx) => {
              return (
                <View key={team.id}>
                  <ListItem multiline>
                    <View style={{ flex: 2 }}>
                      <Text>{`${team.season}`}</Text>
                    </View>
                    <View style={{ flex: 4, paddingRight: 4 }}>
                      <Text>{`${team.name}`}</Text>
                    </View>

                    <View style={{ flex: 4 }}>
                      <Text>
                        {team.competitions.join('\n')}
                      </Text>
                    </View>
                  </ListItem>
                  {idx < teams.length - 1 && <Separator />}
                </View>
              );
            })}
          </ListItem.Group>
          <Separator group />
        </View>
      );
    } else {
      return <View />;
    }
  }

  renderTournaments(tournaments) {
    if (tournaments.length > 0) {
      return (
        <View>
          <ListItem.Group>
            <ListItem.Header title="Turniermeldungen" />
            <ListItem multiline>
              <View style={{ flex: 6 }}>
                <Text bold small numberOfLines={1}>
                  Turnier
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text bold small numberOfLines={1}>
                  Platz
                </Text>
              </View>
              <View style={{ flex: 3, alignItems: 'center' }}>
                <Text bold small numberOfLines={1}>
                  Meldungen
                </Text>
              </View>
            </ListItem>
            <Separator full />
            {tournaments.map((tournament, idx) => {
              return (
                <View key={tournament.id}>
                  <ListItem multiline>
                    <View style={{ flex: 6 }}>
                      <Text
                      >{`${tournament.name} - ${tournament.discipline}`}</Text>
                      <Text>{`${tournament.location} ${moment(
                        tournament.date,
                      ).format(DATE_FORMAT)}`}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <Text>{`${tournament.position}`}</Text>
                    </View>
                    <View style={{ flex: 3, alignItems: 'center' }}>
                      <Text>{`${tournament.participants}`}</Text>
                    </View>
                  </ListItem>
                  {idx < tournaments.length - 1 && <Separator />}
                </View>
              );
            })}
          </ListItem.Group>
          <Separator group />
        </View>
      );
    } else {
      return <View />;
    }
  }

  getPlayer() {
    const { params } = this.props.navigation.state;
    this.props.getPlayer(params.id);
  }
}

export default connect(
  state => ({
    loading: state.loading.list,
    error: state.loading.error,
    players: state.players,
  }),
  dispatch => ({
    getPlayer: id => dispatch(PlayerActions.getPlayer(id)),
  }),
)(Player);
