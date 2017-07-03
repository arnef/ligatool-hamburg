// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { Container, MatchStatsBar, StaticListHeader } from '../components';
import {
  ListItem,
  Text,
  Row,
  Column,
  Image,
  Separator,
} from '../components/base';
import * as LeaguesActions from '../redux/modules/leagues';

import { PLAYER } from './routes';

class PlayerStatsView extends Component {
  componentDidMount() {
    if (!this.props.leagues[this.props.navigation.state.params.id].players) {
      this.getPlayersStats();
    }
  }

  render() {
    const { error, loading } = this.props;
    const bestlist =
      this.props.leagues[this.props.navigation.state.params.id].players || [];

    return (
      <View style={{ flex: 1 }}>
        <StaticListHeader>
          <Row center style={{ marginVertical: 8 }}>
            <Column fluid style={{ width: 24 }} />
            <Column>
              <Text size={12} color="#fff">
                Name
              </Text>
            </Column>
            <Column fluid style={{ width: 36 }} center>
              <Text size={12} color="#fff">
                Q
              </Text>
            </Column>
            <Column fluid style={{ width: 38, alignItems: 'flex-end' }}>
              <Text size={12} color="#fff">
                Spiele
              </Text>
            </Column>
            <Column fluid style={{ width: 38 }} center>
              <Text bold size={12} color="#fff">
                LI
              </Text>
            </Column>
          </Row>
        </StaticListHeader>
        <Container
          hasHeader
          error={error}
          refreshing={loading}
          onRefresh={this.getPlayersStats.bind(this)}
          renderRow={({ item }) =>
            this.renderRow(item, item.position === bestlist.length)}
          dataSource={bestlist}
          ItemSeparatorComponent={() => <Separator table image />}
          keyExtractor={this.keyExtractor.bind(this)}
          getItemLayout={(data, index) => ({
            length: ListItem.ITEM_HEIGHT,
            offset: ListItem.ITEM_HEIGHT * index,
            index,
          })}
        />
      </View>
    );
  }
  keyExtractor(item) {
    return `${item.position}`;
  }

  renderRow(item) {
    return (
      <ListItem
        key={item.position}
        onPress={() => this.props.navigation.navigate(PLAYER, item.player)}
      >
        <Column center fluid style={{ width: 20 }}>
          <Text bold center>{`${item.position}`}</Text>
        </Column>
        <Image
          url={item.player.image}
          size={32}
          style={{ marginHorizontal: 8 }}
        />
        <Column>
          <Row style={{ paddingVertical: 0, paddingHorizontal: 0 }}>
            <Column>
              <Text numberOfLines={1}>{`${item.player.name} ${item.player
                .surname}`}</Text>
            </Column>
            <Column fluid style={{ width: 42, alignItems: 'flex-end' }}>
              <Text>{`${item.rate}`}</Text>
            </Column>
            <Column fluid center style={{ width: 38 }}>
              <Text>{`${item.matches}`}</Text>
            </Column>
            <Column fluid style={{ width: 38 }} center>
              <Text bold>{`${item.competitive_index}`}</Text>
            </Column>
          </Row>
          <Row style={{ paddingVertical: 0, paddingHorizontal: 0 }}>
            <MatchStatsBar small stats={item} />
          </Row>
        </Column>
      </ListItem>
    );
  }

  getPlayersStats() {
    const { id } = this.props.navigation.state.params;
    this.props.getPlayersStats(id);
  }
}

export default connect(
  state => ({
    loading: state.loading.list,
    error: null, //state.loading.error,
    leagues: state.leagues,
  }),
  (dispatch: Dispatch<*>) => ({
    getPlayersStats: (id: number) =>
      dispatch(LeaguesActions.getPlayerStats(id)),
  }),
)(PlayerStatsView);
