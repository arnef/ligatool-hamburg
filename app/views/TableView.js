import React, { Component } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Container, TeamLogo, StaticListHeader } from '../components';
import { Text, ListItem, Separator } from '../components/base';
import { NavigationActions } from 'react-navigation';
import Routes from '../config/routes';
import * as LeaguesActions from '../redux/modules/leagues';

const width = Dimensions.get('window').width - 5 * 40 - 32;

class TableView extends Component {
  componentDidMount() {
    const id = this.props.navigation.state.params.id;

    if (!this.props.leagues[id] || !this.props.leagues[id].table) {
      this._getLeagues();
    }
  }

  _renderTeam(data) {
    return (
      <ListItem last onPress={() => this._onPress(data)}>
        <View style={[styles.column, { width: 20, flex: 0 }]}>
          <Text bold>
            {data.position}
          </Text>
        </View>
        <TeamLogo team={data} />
        <View style={{ flex: 1, paddingLeft: 4, width }}>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {data.name}
          </Text>
        </View>
        <View style={[styles.column, { width: 35, flex: 0 }]}>
          <Text>
            {data.matches}
          </Text>
        </View>
        <View style={[styles.column, { width: 40, flex: 0 }]}>
          <Text>
            {data.set_points_diff}
          </Text>
        </View>
        <View style={[styles.column, { width: 35, flex: 0 }]}>
          <Text>
            {data.goals_diff}
          </Text>
        </View>
        <View style={[styles.column, { width: 35, flex: 0 }]}>
          <Text bold>
            {data.points}
          </Text>
        </View>
      </ListItem>
    );
  }

  _onPress(team) {
    this.props.pushRoute({
      routeName: Routes.TEAM,
      params: { team, title: team.name },
    });
  }

  _getLeagues() {
    const id = this.props.navigation.state.params.id;

    this.props.getLeague(id);
  }

  render() {
    const { leagues } = this.props;
    const table = leagues[this.props.navigation.state.params.id]
      ? leagues[this.props.navigation.state.params.id].table || []
      : [];

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
            <View style={[styles.column, { width: 24, flex: 0 }]} />
            <View style={{ flex: 1, paddingLeft: 4, width }} />
            <View style={[styles.column, { width: 35, flex: 0 }]}>
              <Text small color="#fff">
                Sp.
              </Text>
            </View>
            <View style={[styles.column, { width: 40, flex: 0 }]}>
              <Text small color="#fff">
                Sätze
              </Text>
            </View>
            <View style={[styles.column, { width: 35, flex: 0 }]}>
              <Text small color="#fff">
                Tore
              </Text>
            </View>
            <View style={[styles.column, { width: 35, flex: 0 }]}>
              <Text bold small color="#fff">
                Pkt.
              </Text>
            </View>
          </View>
        </StaticListHeader>

        <Container
          hasHeader
          error={this.props.error}
          refreshing={this.props.loading}
          onRefresh={this._getLeagues.bind(this)}
          renderRow={({ item, index }) => this._renderTeam(item, index, false)}
          keyExtractor={item => `${item.position}`}
          ItemSeparatorComponent={() => <Separator table image />}
          getItemLayout={(data, index) => ({
            length: ListItem.ITEM_HEIGHT,
            offset: ListItem.ITEM_HEIGHT * index,
            index,
          })}
          dataSource={table}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
    alignItems: 'center',
  },
});

export default connect(
  state => ({
    error: null, //state.loading.error,
    loading: state.loading.list,
    leagues: state.leagues,
  }),
  dispatch => ({
    getLeague: id => dispatch(LeaguesActions.getLeague(id)),
    pushRoute: route => dispatch(NavigationActions.navigate(route)),
  }),
)(TableView);
