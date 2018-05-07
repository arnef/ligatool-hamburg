/**
 * Copyright (C) 2018 Arne Feil
 *
 * This file is part of DTFB App.
 *
 * DTFB App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DTFB App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DTFB App.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import * as React from 'react';
import { View } from 'react-native';
import {
  Content,
  ListItem,
  Image,
  Separator,
  Text,
} from '../../../../components';
import { Strings } from '@app/lib/strings';
import { Item } from './components/item';
import { default as moment } from 'moment';
import { DATE_FORMAT } from '@app/config/settings';

import { Singles } from './components/singles';
import { Doubles } from './components/doubles';
import { getNavigationStateParams } from '../../../../redux/modules/navigation';
import { Dispatch, connect } from 'react-redux';
import { getPlayer } from '../../../../redux/modules/player';

interface Props extends StateProps, DispatchProps {}

class Player extends React.PureComponent<Props> {
  public render() {
    const { getPlayer, player } = this.props;
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
                  name={Strings.NAME}
                  value={`${player.data.name} ${player.data.surname}`}
                />
                <Item
                  name={Strings.CLASSIFICATION}
                  value={player.meta.classification}
                />
                <Item
                  name={Strings.NATIONAL_NUMBER}
                  value={player.meta.playerNumber}
                />
                <Item
                  name={Strings.INTERNATIONAL_NUMBER}
                  value={player.meta.licenceNumber}
                />
                <Item
                  name={Strings.TEAM}
                  value={
                    player.meta.teams[0] ? player.meta.teams[0].name : null
                  }
                />
                {player.meta.clubs && (
                  <Item
                    name={Strings.CLUB}
                    value={player.meta.clubs.join(', ')}
                    last={!player.meta.associations}
                  />
                )}
                {player.meta.associations && (
                  <Item
                    name={Strings.ASSOCIATION}
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
                      title={`${Strings.RANKING_POSITIONS} ${
                        player.meta.rankings[0].season
                      }`}
                    />
                    <ListItem multiline>
                      <Text bold small numberOfLines={1} style={{ flex: 6 }}>
                        {Strings.RANKING}
                      </Text>
                      <Text
                        bold
                        small
                        numberOfLines={1}
                        style={{ flex: 1, textAlign: 'right' }}
                      >
                        {Strings.POSITION}
                      </Text>
                      <Text
                        bold
                        small
                        numberOfLines={1}
                        style={{ flex: 3, textAlign: 'right' }}
                      >
                        {Strings.PARTICIPANTS}
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
                    <ListItem.Header
                      title={Strings.TOURNAMENT_PARTICIPATIONS}
                    />
                    <ListItem multiline>
                      <Text bold small numberOfLines={1} style={{ flex: 6 }}>
                        {Strings.TOURNAMENT}
                      </Text>
                      <Text
                        bold
                        small
                        numberOfLines={1}
                        style={{ flex: 1, textAlign: 'right' }}
                      >
                        {Strings.POSITION}
                      </Text>
                      <Text
                        bold
                        small
                        numberOfLines={1}
                        style={{ flex: 3, textAlign: 'right' }}
                      >
                        {Strings.PARTICIPANTS}
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
                <ListItem.Header title={Strings.LAST_SINGLES} />
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
                <ListItem.Header title={Strings.LAST_DOUBLES} />
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
                <ListItem.Header title={Strings.TEAMS} />
                <ListItem multiline>
                  <Text bold small numberOfLines={1} style={{ flex: 2 }}>
                    {Strings.SEASON}
                  </Text>
                  <Text bold small numberOfLines={1} style={{ flex: 4 }}>
                    {Strings.NAME}
                  </Text>
                  <Text bold small numberOfLines={1} style={{ flex: 4 }}>
                    {Strings.COMPETITIONS}
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

interface StateProps {
  player: any;
}

interface DispatchProps {
  getPlayer: Function;
}

function mapStateToProps(state: any, props: any): StateProps {
  return {
    player: state.players[getNavigationStateParams(props.navigation).id],
  };
}

function mapDispatchToProps(
  dispatch: Dispatch<any>,
  props: any,
): DispatchProps {
  return {
    getPlayer: () =>
      dispatch(getPlayer(getNavigationStateParams(props.navigation).id)),
  };
}

export const PlayerDetails = connect(mapStateToProps, mapDispatchToProps)(
  Player,
);
