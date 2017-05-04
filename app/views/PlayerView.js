/* @flow */
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Container } from '../components';
import { Image, ListItem, Text, Row, Column } from '../components/base'
import api from '../api';

class PlayerView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      fetched: false,
      player: null
    };
  }

  componentDidMount() {
    this.getPlayer();
  }

  render() {
    const player = this.state.player || this.props.navigation.state.params.player;
    const props = {
      refreshing: this.state.loading,
      onRefresh: this.getPlayer.bind(this)
    };
    return (
      <Container { ...props }>
        <ListItem.Group>
          <View style={style.imageContainer}>
            <Image url={ player.image } width={180} height={240} />
          </View>
          { this.renderRow('Name', `${player.name} ${player.surname}`) }
          { this.renderRow('Spielernummer', player.number) }
          { this.renderRow('Internationale Spielernr', player.international_number) }
          { this.renderRow('Einstufung', player.classification) }
          { this.renderRow('Verein', player.club ? player.club.name : null) }
          { this.renderRow('Organisation', player.association ? player.association.name : null) }
          { player.teams && (
            <View style={style.row}>
              <Text bold>{ player.teams.length > 1 ? 'Teams': 'Team' }: </Text>
              <View>
                { player.teams.map( team => {
                  return (<Text key={team.id}>{team.name} ({team.season})</Text>)
                })}
              </View>
            </View>
          )}
          { player.statistics && player.statistics.length > 0 && (
            <View style={{ paddingHorizontal: 12, paddingVertical: 3}}>
              <Text bold>Statistiken { player.statistics[0].name }</Text>
              <Row fluid style={{ justifyContent: 'space-around'}}>
                <Column center>
                  <Text bold>Pos.</Text><Text>{ player.statistics[0].position }</Text>
                </Column>
                <Column center>
                  <Text bold>Quote</Text><Text>{ player.statistics[0].rate }</Text>
                </Column>
                <Column center style={{marginLeft: 10}}>
                  <Text bold>Spiele</Text><Text>{ player.statistics[0].matches }</Text>
                </Column>
                <Column center>
                  <Text bold>S.</Text><Text>{ player.statistics[0].wins }</Text>
                </Column>
                <Column center>
                  <Text bold>U.</Text><Text>{ player.statistics[0].draws }</Text>
                </Column>
                <Column center>
                  <Text bold>N.</Text><Text>{ player.statistics[0].lost }</Text>
                </Column>
              </Row>
            </View>
          )}
          { player.ranglists && player.ranglists.length > 0 && (
            <View style={{ paddingHorizontal: 12, paddingVertical: 3}}>
              <Text bold>Ranglistenplatzierungen { player.ranglists[0].season }</Text>
              { player.ranglists.map((item, idx) => {
                return (
                  <Row fluid key={item.id} style={idx % 2 === 1 ? { backgroundColor: '#eee'} : {}}>
                  <Text>{ item.name }</Text>
                  <Column />
                  <Text>{ item.position } / {item.participants }</Text>
                  </Row>
                )
              })}
            </View>
          )}
          { player.tournament_participations && player.tournament_participations.length > 0 && (
            <Row>
              <Column>
                <Text bold>Turnierteilnahmen</Text>
                { player.tournament_participations.map( (item, idx) => {
                    return (
                      <Row fluid key={item.id} style={idx % 2 === 0 ? { backgroundColor: '#eee'} : {}}>
                        <Text>{ item.discipline } ({item.location})</Text>
                        <Column />
                        <Text>{ item.position } / { item.participants }</Text>
                      </Row>
                    )
                })}
              </Column>
            </Row>
          )}
        </ListItem.Group>
      </Container>
    );
  }

  renderRow(name, value) {
    if (value) {
    return (
      <View style={style.row}>
        <Text bold>{ name }: </Text><Text>{ value }</Text>
      </View>
    )
    }
    return (<View />)
  }

  getPlayer() {
    const player = this.props.navigation.state.params.player;
    api.get('/players/' + player.id).then( resp => {
      if (resp.ok) {
        this.setState({ player: resp.data, loading: false, fetched: true });
      }
    })
  }
}

PlayerView.navigationOptions = {
  title: ({ state }) => `${state.params.player.name} ${state.params.player.surname}`
};

const style = StyleSheet.create({
  imageContainer: {
    flex: 1,
    padding: 16,
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6
  }
});

export default PlayerView;
