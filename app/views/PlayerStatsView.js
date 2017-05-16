// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Container, MatchStatsBar, StaticListHeader } from '../components';
import { ListItem, Text, Row, Column, Image } from '../components/base';
import { getPlayersStats } from '../store/actions/leagueActions';
import { PLAYER } from './routes';

class PlayerStatsView extends Component {

  componentWillMount() {
    if (!this.props.leagues[this.props.navigation.state.params.id].players) {
      this.getPlayersStats();
    }
  }

  render() {
    const { error, loading } = this.props;
    const bestlist = this.props.leagues[this.props.navigation.state.params.id].players || [];

    return (
      <View style={{flex: 1}}>
        <StaticListHeader>
          <Column fluid style={{ width: 30 }}>
          </Column>
          <Column>
            <Text size={12}>Name</Text>
          </Column>
          <Column fluid style={{ width: 38 }} center>
            <Text bold size={12}>LI</Text>
          </Column>
          <Column fluid style={{ width: 36 }} center>
            <Text size={12}>Q</Text>
          </Column>
          <Column fluid style={{ width: 38, alignItems: 'flex-end' }}>
            <Text size={12}>Spiele</Text>
          </Column>
        </StaticListHeader>
        <Container
          error={error}
          refreshing={loading}
          onRefresh={this.getPlayersStats.bind(this)}
          renderRow={({item}) => this.renderRow(item, item.position === bestlist.length)}
          dataSource={bestlist}
          keyExtractor={this.keyExtractor.bind(this)}
        />
      </View>
    )
  }
  keyExtractor(item) {
    return `${item.position}`;
  }

  renderRow(item, last) {
    return (
      <ListItem
        key={item.position}
        onPress={() => this.props.navigation.navigate(PLAYER, item.player)}>
          <Column center fluid style={{ width: 20 }}>
            <Text bold center>{ `${item.position}` }</Text>
          </Column>
          <Image url={item.player.image} width={48} height={32} />
            <Column>
              <Row fluid>
            <Column>
              <Text numberOfLines={1}>{ `${item.player.name} ${item.player.surname}`}</Text>
            </Column>
            <Column fluid style={{ width: 38}} center>
              <Text>{ `${item.competitive_index}`}</Text>
            </Column>
            <Column fluid style={{ width: 42, alignItems: 'flex-end'}}>
              <Text>{ `${item.rate}`}</Text>
            </Column>
            <Column fluid style={{ width: 38, alignItems: 'flex-end'}}>
              <Text>{ `${item.matches}`}</Text>
            </Column>
            </Row>
            <MatchStatsBar small stats={item} />
          </Column>
      </ListItem>
    )
  }

  getPlayersStats() {
    const { id } = this.props.navigation.state.params;
    this.props.getPlayersStats(id);
  }
}

export default connect(
  state => ({
    loading: state.loading.nonBlocking,
    error: state.loading.error,
    leagues: state.leagues
  }),
  dispatch => ({
    getPlayersStats: (id: number ) => dispatch(getPlayersStats(id))
  })
)(PlayerStatsView);
