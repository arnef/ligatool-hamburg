// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { getPlayer } from '../store/actions/playersActions';
import { Container, MatchStatsBar } from '../components';
import {
  Text,
  Image,
  Row,
  Column,
  ListItem,
  Separator,
} from '../components/base';
import { formatDate } from '../Helper';
import strings from '../Strings';

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
          <Text bold>{name}</Text>
          <Text>{value ? value : '-'}</Text>
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
        <Row>
          <Column center>
            <Image url={player.image} height={240} width={180} />
          </Column>
        </Row>
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
              <Column width={2} center>
                <Text bold size={12} numberOfLines={1}>Platz</Text>
              </Column>
              <Column width={2} center>
                <Text size={12} numberOfLines={1}>Spiele</Text>
              </Column>
              <Column width={3} center>
                <Text center size={12} numberOfLines={1}>
                  Spielpunkte Quote
                </Text>
              </Column>
              <Column width={3} center>
                <Text bold size={12} numberOfLines={1}>Leistungsindex</Text>
              </Column>
            </ListItem>
            <Separator full />
            <ListItem multiline>
              <Column width={2} center>
                <Text bold center>{`${stat.position}`}</Text>
              </Column>
              <Column width={2} center>
                <Text center>{`${stat.matches}`}</Text>
              </Column>
              <Column width={3} center>
                <Text center>{`${stat.rate}`}</Text>
              </Column>
              <Column width={3} center>
                <Text center bold>{`${stat.competitive_index}`}</Text>
              </Column>
            </ListItem>
            <ListItem multiline>
              <Column>
                <MatchStatsBar stats={stat} />
                <Row>
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
                </Row>
              </Column>
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
              <Column width={6}>
                <Text bold size={12} numberOfLines={1}>Rangliste</Text>
              </Column>
              <Column width={1} center>
                <Text bold size={12} numberOfLines={1}>Platz</Text>
              </Column>
              <Column width={3} center>
                <Text bold size={12} numberOfLines={1}>Meldungen</Text>
              </Column>
            </ListItem>
            <Separator full />
            {ranglists.map((ranglist, idx) => {
              return (
                <View key={ranglist.id}>
                  <ListItem multiline>
                    <Column width={6}>
                      <Text>{`${ranglist.name}`}</Text>
                    </Column>
                    <Column width={1} center>
                      <Text>{`${ranglist.position}`}</Text>
                    </Column>
                    <Column width={3} center>
                      <Text>{`${ranglist.participants}`}</Text>
                    </Column>
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
              <Column width={2}>
                <Text bold size={12} numberOfLines={1}>Saison</Text>
              </Column>
              <Column width={4}>
                <Text bold size={12} numberOfLines={1}>Name</Text>
              </Column>
              <Column width={4}>
                <Text bold size={12} numberOfLines={1}>Wettbewerbe</Text>
              </Column>
            </ListItem>
            <Separator full />
            {teams.map((team, idx) => {
              return (
                <View key={team.id}>
                  <ListItem multiline>
                    <Column width={2}>
                      <Text>{`${team.season}`}</Text>
                    </Column>
                    <Column width={4} style={{ paddingRight: 4 }}>
                      <Text>{`${team.name}`}</Text>
                    </Column>

                    <Column width={4}>
                      <Text>{team.competitions.join('\n')}</Text>
                    </Column>
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
              <Column width={6}>
                <Text bold size={12} numberOfLines={1}>Turnier</Text>
              </Column>
              <Column width={1} center>
                <Text bold size={12} numberOfLines={1}>Platz</Text>
              </Column>
              <Column width={3} center>
                <Text bold size={12} numberOfLines={1}>Meldungen</Text>
              </Column>
            </ListItem>
            <Separator full />
            {tournaments.map((tournament, idx) => {
              return (
                <View key={tournament.id}>
                  <ListItem multiline>
                    <Column width={6}>
                      <Text
                      >{`${tournament.name} - ${tournament.discipline}`}</Text>
                      <Text>{`${tournament.location} ${formatDate(
                        tournament.date,
                      )}`}</Text>
                    </Column>
                    <Column width={1} center>
                      <Text>{`${tournament.position}`}</Text>
                    </Column>
                    <Column width={3} center>
                      <Text>{`${tournament.participants}`}</Text>
                    </Column>
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
    loading: state.loading.nonBlocking,
    error: state.loading.error,
    players: state.players,
  }),
  (dispatch: Dispatch<*>) => ({
    getPlayer: (id: number) => dispatch(getPlayer(id)),
  }),
)(PlayerView);
