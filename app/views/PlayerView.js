// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import * as PlayerActions from '../redux/modules/player';
import { Container, MatchStatsBar } from '../components';
import { Text, Image, ListItem, Separator } from '../components/base';
import { formatDate } from '../Helper';
import strings from '../lib/strings';

class PlayerView extends Component {
  componentDidMount() {
    if (!this.props.players[this.props.navigation.state.params.id]) {
      this.getPlayer();
    }
  }

  renderItem(name: string, value: string) {
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
      <Container
        refreshing={loading}
        error={error}
        onRefresh={this.getPlayer.bind(this)}
      >
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
        <ListItem.Header title={strings.player_info} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image url={player.image} height={240} width={180} />
          </View>
        </View>
        {this.renderItem('Name', `${player.name} ${player.surname}`)}
        <Separator />
        {this.renderItem('Einstufung', player.classification)}
        <Separator />
        {this.renderItem('Nationale Spielernr.', player.number)}
        <Separator />
        {this.renderItem(
          'Internationale Spielernr.',
          player.international_number,
        )}
        <Separator />
        {player.teams.length > 0 &&
          this.renderItem('Team', player.teams[0].name)}
        {player.teams.length > 0 && <Separator />}
        {this.renderItem('Verein', player.club.name)}
        <Separator />
        {this.renderItem('Verband', player.association.name, true)}
      </ListItem.Group>
    );
  }

  renderStats(stats) {
    if (stats.length > 0) {
      return stats.sort((a, b) => (a.name < b.name ? -1 : 1)).map((stat, idx) =>
        <View key={idx}>
          <ListItem.Group>
            <ListItem.Header title={`Statistik ${stat.name}`} />
            <ListItem multiline>
              <View style={{ flex: 2, alignItems: 'center' }}>
                <Text bold small numberOfLines={1}>
                  Platz
                </Text>
              </View>
              <View style={{ flex: 2, alignItems: 'center' }}>
                <Text small numberOfLines={1}>
                  Spiele
                </Text>
              </View>
              <View style={{ flex: 3, alignItems: 'center' }}>
                <Text center small numberOfLines={1}>
                  Spielpunkte Quote
                </Text>
              </View>
              <View style={{ flex: 3, alignItems: 'center' }}>
                <Text bold small numberOfLines={1}>
                  Leistungsindex
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
                  >{`${stat.wins} Sieg${stat.wins !== 1 ? 'e' : ''}`}</Text>
                  <Text
                    style={{ flex: 1, fontSize: 10, textAlign: 'center' }}
                  >{`${stat.draws} Unentschieden`}</Text>
                  <Text
                    style={{ flex: 1, fontSize: 10, textAlign: 'right' }}
                  >{`${stat.lost} Niederlage${stat.lost !== 1
                    ? 'n'
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
                      <Text>{`${tournament.location} ${formatDate(
                        tournament.date,
                      )}`}</Text>
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
  (dispatch: Dispatch<*>) => ({
    getPlayer: (id: number) => dispatch(PlayerActions.getPlayer(id)),
  }),
)(PlayerView);
