// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { getPlayer } from '../store/actions/playersActions';
import { Container, MatchStatsBar } from '../components';
import { Text, Image, Row, Column, ListItem } from '../components/base';
import { formatDate } from '../Helper';

class PlayerView extends Component {

  componentWillMount() {
    if (!this.props.players[this.props.navigation.state.params.id]) {
      this.getPlayer();
    }
  }

  renderItem(name, value) {
    return (
      <View style={{marginVertical: 2}}>
        <Text bold size={12}>{ name }</Text>
        <Text>{ value ? value : '-'}</Text>
      </View>
    )
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
        { player && (
          <View>
          { this.renderInformation(player) }
          { this.renderStats(player.statistics) }
          { this.renderRanglists(player.ranglists) }
          { this.renderTournaments(player.tournament_participations)}
          { this.renderTeams(player.teams) }
          </View>
        )}
      </Container>
    );
  }

  renderInformation(player) {
    return (
      <ListItem.Group>
        <ListItem.Header title='Information' />
        <Row>
          <Image url={player.image} height={120} width={90} style={{marginRight: 8}} />
          <Column>
            { this.renderItem('Name', `${player.name} ${player.surname}`)}
            { this.renderItem('Einstufung', player.classification) }
            { this.renderItem('Nationale Spielernr.', player.number) }
            { this.renderItem('Internationale Spielernr.', player.international_number) }
            { player.teams.length > 0 && this.renderItem('Team', player.teams[0].name)}
            { this.renderItem('Verein', player.club.name )}
            { this.renderItem('Verband', player.association.name)}
          </Column>
        </Row>
      </ListItem.Group>
    );
  }

  renderStats(stats) {
    if (stats.length > 0) {
      return (
        <ListItem.Group>
          <ListItem.Header title={`Statistik ${stats[0].name}`} />
          <Row>
            <Column width={2} center>
              <Text bold size={12}>Platz</Text>
            </Column>
            <Column width={4} center>
              <Text bold size={12}>Leistungsindex</Text>
            </Column>
            <Column width={3} center>
              <Text center bold size={12}>Spielpunkte Quote</Text>
            </Column>
            <Column width={2} center>
              <Text bold size={12}>Spiele</Text>
            </Column>
          </Row>
          <Row>
            <Column width={2} center>
              <Text center>{ `${stats[0].position}`}</Text>
            </Column>
            <Column width={4} center>
              <Text center>{ `${stats[0].competitive_index}`}</Text>
            </Column>
            <Column width={3} center>
              <Text center>{ `${stats[0].rate}`}</Text>
            </Column>
            <Column width={2} center>
              <Text center>{ `${stats[0].matches}`}</Text>
            </Column>
          </Row>
          <Row>
          <Column>
              <MatchStatsBar stats={stats[0]} />
              <Row>
                <Text style={{ flex: 1, fontSize: 10 }}>{ `${stats[0].wins} Sieg${stats[0].wins !== 1 ? 'e' : ''}`}</Text>
                <Text style={{ flex: 1, fontSize: 10, textAlign: 'center' }}>{ `${stats[0].draws} Unentschieden`}</Text>
                <Text style={{ flex: 1, fontSize: 10, textAlign: 'right' }}>{ `${stats[0].lost} Niederlage${stats[0].lost !== 1 ? 'n' : ''}`}</Text>
              </Row>
            </Column>
          </Row>
        </ListItem.Group>
      );
    }
    return (<View />)
  }

  renderRanglists(ranglists) {
    if (ranglists.length > 0) {
      return (
        <ListItem.Group>
          <ListItem.Header title={`Ranglistenplatzierungen ${ranglists[0].season}`} />
          <Row>
            <Column width={6}>
              <Text bold size={12}>Rangliste</Text>
            </Column>
            <Column width={1} center>
              <Text bold size={12}>Platz</Text>
            </Column>
            <Column width={3} center>
              <Text bold size={12}>Meldungen</Text>
            </Column>
          </Row>
          { ranglists.map((ranglist, idx) => {
            const backgroundColor = idx % 2 === 0 ? rowBackground : null;
            return (
              <Row key={ranglist.id} style={{ backgroundColor }}>
                <Column width={6}>
                  <Text>{ `${ranglist.name}`}</Text>
                </Column>
                <Column width={1} center>
                  <Text>{ `${ranglist.position}` }</Text>
                </Column>
                <Column width={3} center>
                  <Text>{ `${ranglist.participants}` }</Text>
                </Column>
              </Row>);
          })}
        </ListItem.Group>
      )
    } else {
      return (<View />);
    }
  }

  renderTeams(teams) {
    if (teams.length > 0) {
      return (
        <ListItem.Group>
          <ListItem.Header title='Teams' />
          <Row>
            <Column width={2}>
              <Text bold size={12}>Saison</Text>
            </Column>
            <Column width={4}>
              <Text bold size={12}>Name</Text>
            </Column>

            <Column width={4}>
              <Text bold size={12}>Wettbewerbe</Text>
            </Column>
          </Row>
          { teams.map((team, idx) => {
            const backgroundColor = idx % 2 === 0 ? rowBackground : null;
            return (
              <Row key={team.id} style={{backgroundColor}}>
                <Column width={2}>
                  <Text>{ `${team.season}` }</Text>
                </Column>
                <Column width={4} style={{paddingRight: 4}}>
                  <Text>{ `${team.name}` }</Text>
                </Column>

                <Column width={4}>
                  <Text>{ team.competitions.join('\n') }</Text>
                </Column>
              </Row>
            )
          })}
        </ListItem.Group>
      )
    } else {
      return (<View />);
    }
  }

  renderTournaments(tournaments) {
    if (tournaments.length > 0) {
      return (
        <ListItem.Group>
          <ListItem.Header title='Turniermeldungen' />
          <Row>
            <Column width={6}>
              <Text bold size={12}>Turnier</Text>
            </Column>
            <Column width={1} center>
              <Text bold size={12}>Platz</Text>
            </Column>
            <Column width={3} center>
              <Text bold size={12}>Meldungen</Text>
            </Column>
          </Row>
          { tournaments.map((tournament, idx) => {
            const backgroundColor = idx % 2 === 0 ? rowBackground : null;
            return (
              <Row key={tournament.id} style={{ backgroundColor}}>
                <Column width={6}>
                  <Text>{ `${tournament.name}` }</Text>
                  <Text size={12}>{ `${tournament.discipline}\n${tournament.location} ${formatDate(tournament.date)}`}</Text>
                </Column>
                <Column width={1} center>
                  <Text>{ `${tournament.position}`}</Text>
                </Column>
                <Column width={3} center>
                  <Text>{ `${tournament.participants}`}</Text>
                </Column>
              </Row>
            )
          })}
        </ListItem.Group>
      );
    } else {
      return (<View />);
    }
  }

  getPlayer() {
    const { params } = this.props.navigation.state;
    this.props.getPlayer(params.id);
  }
}

const rowBackground = '#efefef';

export default connect(
  state => ({
    loading: state.loading.nonBlocking,
    error: state.loading.error,
    players: state.players
  }),
  dispatch => ({
    getPlayer: (id: number) => dispatch(getPlayer(id))
  })
)(PlayerView);
