// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { Container, MatchStatsBar, StaticListHeader } from '../components';
import { ListItem, Text, Column, Image, Separator } from '../components/base';
import * as LeaguesActions from '../redux/modules/leagues';
import Routes from '../config/routes';

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
          <View
            style={{
              marginVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Column fluid style={{ width: 24 }} />
            <Column>
              <Text small color="#fff">
                Name
              </Text>
            </Column>
            <Column fluid style={{ width: 36 }} center>
              <Text small color="#fff">
                Q
              </Text>
            </Column>
            <Column fluid style={{ width: 38, alignItems: 'flex-end' }}>
              <Text small color="#fff" numberOfLines={1}>
                Spiele
              </Text>
            </Column>
            <Column fluid style={{ width: 38 }} center>
              <Text small bold color="#fff">
                LI
              </Text>
            </Column>
          </View>
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
        onPress={() =>
          this.props.navigation.navigate(Routes.PLAYER, item.player)}
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
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 0,
              paddingHorizontal: 0,
            }}
          >
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
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 0,
              paddingHorizontal: 0,
            }}
          >
            <MatchStatsBar small stats={item} />
          </View>
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
