// @flow
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { Container, MatchStatsBar, StaticListHeader } from '../components';
import { ListItem, Text, Image, Separator } from '../components/base';
import * as LeaguesActions from '../redux/modules/leagues';
import Routes from '../config/routes';

const styles = StyleSheet.create({
  cell24: {
    width: 24,
  },
  cellFlex: {
    flex: 1,
  },
  cell36: {
    width: 36,
    alignItems: 'center',
  },
  cell38: {
    width: 38,
  },
});

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
            <View style={styles.cell24} />
            <View style={styles.cellFlex}>
              <Text small color="#fff">
                Name
              </Text>
            </View>
            <View style={styles.cell36}>
              <Text small color="#fff">
                Q
              </Text>
            </View>
            <View style={[styles.cell38, { alignItems: 'flex-end' }]}>
              <Text small color="#fff" numberOfLines={1}>
                Spiele
              </Text>
            </View>
            <View style={[styles.cell38, { alignItems: 'center' }]}>
              <Text small bold color="#fff">
                LI
              </Text>
            </View>
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
        <View style={{ alignItems: 'center', width: 20 }}>
          <Text bold center>{`${item.position}`}</Text>
        </View>
        <Image
          url={item.player.image}
          size={32}
          style={{ marginHorizontal: 8 }}
        />
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 0,
              paddingHorizontal: 0,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1}>{`${item.player.name} ${item.player
                .surname}`}</Text>
            </View>
            <View style={{ width: 42, alignItems: 'flex-end' }}>
              <Text>{`${item.rate}`}</Text>
            </View>
            <View style={{ alignItems: 'center', width: 38 }}>
              <Text>{`${item.matches}`}</Text>
            </View>
            <View style={{ alignItems: 'center', width: 38 }}>
              <Text bold>{`${item.competitive_index}`}</Text>
            </View>
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
        </View>
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
