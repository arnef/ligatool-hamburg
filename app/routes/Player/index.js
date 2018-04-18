import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import * as PlayerActions from '../../redux/modules/player';
import { DATE_FORMAT } from '../../config/settings';
import {
  Text,
  Image,
  ListItem,
  Separator,
  Score,
  Content,
} from '../../components';
import S from '../../lib/strings';
import { getNavigationStateParams } from '../../redux/modules/navigation';

function Player(props) {
  const { reverse, winner } = props;

  return (
    <View
      style={{
        flexDirection: reverse ? 'row-reverse' : 'row',
        flex: 2,
        margin: 3,
        alignItems: 'center',
      }}
    >
      {props.player && <Image url={props.player.image} size={32} />}
      <Text center bold={winner} style={{ flex: 1 }}>
        {`${props.player.name} ${props.player.surname}`}
      </Text>
    </View>
  );
}
function Item(props) {
  const { name, value, last = false } = props;

  return (
    <View>
      <ListItem multiline>
        <View>
          <Text bold>{`${name}`}</Text>
          <Text>{`${value ? value : '-'}`}</Text>
        </View>
      </ListItem>
      {!last && <Separator />}
    </View>
  );
}

function Singles(props) {
  const { data, id } = props;
  const result =
    data.result === 'DRAW'
      ? { goalsHome: 1, goalsAway: 1 }
      : (data.result === 'WIN' && id === data.homePlayer.id) ||
        (data.result == 'LOST' && id != data.homePlayer.id)
        ? { goalsHome: 1, goalsAway: 0 }
        : { goalsHome: 0, goalsAway: 1 };
  return (
    <ListItem multiline>
      <View style={{ flex: 1 }}>
        <Text bold style={{ paddingBottom: 12 }}>{`${data.competitionName} - ${
          data.round
        }`}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Player player={data.homePlayer} reverse />
          <Score goals={result} />
          <Player player={data.awayPlayer} />
        </View>
      </View>
    </ListItem>
  );
}

function Doubles(props) {
  const { data } = props;
  const result =
    data.result === 'DRAW'
      ? { goalsHome: 1, goalsAway: 1 }
      : (data.result === 'WIN' &&
          (props.id == data.homePlayer1.id ||
            props.id == data.homePlayer2.id)) ||
        (data.result == 'LOST' &&
          (props.id != data.homePlayer1.id && props.id != data.homePlayer2.id))
        ? { goalsHome: 1, goalsAway: 1 }
        : { goalsHome: 0, goalsAway: 1 };
  return (
    <ListItem multiline>
      <View style={{ flex: 1 }}>
        <Text bold style={{ paddingBottom: 12 }}>{`${
          props.data.competitionName
        } - ${props.data.round}`}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Player reverse player={data.homePlayer1} />
            <Player reverse player={data.homePlayer2} />
          </View>
          <Score goals={result} />
          <View style={{ flex: 1 }}>
            <Player player={data.awayPlayer1} />
            <Player player={data.awayPlayer2} />
          </View>
        </View>
      </View>
    </ListItem>
  );
}

class PlayerDetails extends Component {
  render() {
    const { player, getPlayer } = this.props;
    return (
      <Content onRefresh={getPlayer}>
        {player &&
          player.data &&
          player.meta && (
            <View>
              <ListItem.Group>
                <View style={{ alignItems: 'center' }}>
                  <Image url={player.data.image} height={240} width={180} />
                </View>
                <Item
                  name={S.NAME}
                  value={`${player.data.name} ${player.data.surname}`}
                />
                <Item
                  name={S.CLASSIFICATION}
                  value={player.meta.classification}
                />
                <Item
                  name={S.NATIONAL_NUMBER}
                  value={player.meta.playerNumber}
                />
                <Item
                  name={S.INTERNATIONAL_NUMBER}
                  value={player.meta.licenceNumber}
                />
                <Item
                  name={S.TEAM}
                  value={
                    player.meta.teams[0] ? player.meta.teams[0].name : null
                  }
                />
                {player.meta.clubs && (
                  <Item
                    name={S.CLUB}
                    value={player.meta.clubs.join(', ')}
                    last={!player.meta.associations}
                  />
                )}
                {player.meta.associations && (
                  <Item
                    name={S.ASSOCIATION}
                    value={player.meta.associations.join(', ')}
                    last
                  />
                )}
              </ListItem.Group>
              <Separator group />

              {player.meta.rankings &&
                player.meta.rankings.length > 0 && (
                  <ListItem.Group>
                    <ListItem.Header
                      title={`Ranglistenplatzierung ${
                        player.meta.rankings[0].season
                      }`}
                    />
                    <ListItem multiline>
                      <Text bold small numberOfLines={1} style={{ flex: 6 }}>
                        Rangliste
                      </Text>
                      <Text
                        bold
                        small
                        numberOfLines={1}
                        style={{ flex: 1, textAlign: 'right' }}
                      >
                        Platz
                      </Text>
                      <Text
                        bold
                        small
                        numberOfLines={1}
                        style={{ flex: 3, textAlign: 'right' }}
                      >
                        Meldungen
                      </Text>
                    </ListItem>
                    <Separator full />
                    {player.meta.rankings.map((r, i) => (
                      <View key={`ranking-${i}`}>
                        <ListItem multiline>
                          <Text style={{ flex: 6 }}>{`${r.name}`}</Text>
                          <Text style={{ flex: 1, textAlign: 'right' }}>{`${
                            r.rank
                          }`}</Text>
                          <Text style={{ flex: 3, textAlign: 'right' }}>{`${
                            r.participants
                          }`}</Text>
                        </ListItem>
                        {i < player.meta.rankings.length - 1 && <Separator />}
                      </View>
                    ))}
                  </ListItem.Group>
                )}
              {player.meta.rankings &&
                player.meta.rankings.length > 0 && <Separator group />}

              {player.meta.tournaments &&
                player.meta.tournaments.length > 0 && (
                  <ListItem.Group>
                    <ListItem.Header title="Turniermeldungen" />
                    <ListItem multiline>
                      <Text bold small numberOfLines={1} style={{ flex: 6 }}>
                        Turnier
                      </Text>
                      <Text
                        bold
                        small
                        numberOfLines={1}
                        style={{ flex: 1, textAlign: 'right' }}
                      >
                        Platz
                      </Text>
                      <Text
                        bold
                        small
                        numberOfLines={1}
                        style={{ flex: 3, textAlign: 'right' }}
                      >
                        Meldungen
                      </Text>
                    </ListItem>
                    <Separator full />
                    {player.meta.tournaments.map((t, i) => (
                      <View key={`tournament-${i}`}>
                        <ListItem multiline>
                          <View style={{ flex: 6 }}>
                            <Text>{`${t.name} - ${t.discipline}`}</Text>
                            <Text small>{`${t.location} ${moment(t.date).format(
                              DATE_FORMAT,
                            )}`}</Text>
                          </View>
                          <Text style={{ flex: 1, textAlign: 'right' }}>{`${
                            t.rank
                          }`}</Text>
                          <Text style={{ flex: 3, textAlign: 'right' }}>{`${
                            t.participants
                          }`}</Text>
                        </ListItem>
                      </View>
                    ))}
                  </ListItem.Group>
                )}
              {player.meta.tournaments &&
                player.meta.tournaments.length > 0 && <Separator group />}

              <ListItem.Group>
                <ListItem.Header title="Letzte Einzel" />
                {player.meta.lastSingles.map((s, i) => (
                  <View key={`singles-${i}`}>
                    <Singles data={s} id={player.data.id} />
                    {i < player.meta.lastSingles.length - 1 && (
                      <Separator full />
                    )}
                  </View>
                ))}
              </ListItem.Group>
              <Separator group />
              <ListItem.Group>
                <ListItem.Header title="Letzte Doppel" />
                {player.meta.lastDoubles.map((d, i) => (
                  <View key={`doubles-${i}`}>
                    <Doubles
                      data={d}
                      id={player.data.id}
                      key={`doubles-${i}`}
                    />
                    {i < player.meta.lastDoubles.length - 1 && (
                      <Separator full />
                    )}
                  </View>
                ))}
              </ListItem.Group>

              <Separator group />
              <ListItem.Group>
                <ListItem.Header title="Teams" />
                <ListItem multiline>
                  <Text bold small numberOfLines={1} style={{ flex: 2 }}>
                    Saison
                  </Text>
                  <Text bold small numberOfLines={1} style={{ flex: 4 }}>
                    Name
                  </Text>
                  <Text bold small numberOfLines={1} style={{ flex: 4 }}>
                    Wettbewerbe
                  </Text>
                </ListItem>
                <Separator full />
                {player.meta.teams.map((t, i) => (
                  <View key={`team-${i}`}>
                    <ListItem multiline>
                      <Text style={{ flex: 2 }}>{`${t.season}`}</Text>
                      <Text style={{ flex: 4 }}>{`${t.name}`}</Text>
                      <Text style={{ flex: 4 }}>
                        {t.competitionNames.join(',')}
                      </Text>
                    </ListItem>
                  </View>
                ))}
              </ListItem.Group>
              <Separator group />
            </View>
          )}
      </Content>
    );
  }
}

export default connect(
  (state, props) => ({
    players: state.players,
    player: state.players[getNavigationStateParams(props.navigation).id],
  }),
  (dispatch, props) => ({
    getPlayer: () =>
      dispatch(
        PlayerActions.getPlayer(getNavigationStateParams(props.navigation).id),
      ),
  }),
)(PlayerDetails);
