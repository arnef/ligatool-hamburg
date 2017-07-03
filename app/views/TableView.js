import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
import { connect } from 'react-redux';
import actions from '../store/actions';
import { Container, TeamLogo, StaticListHeader } from '../components';
import { Text, ListItem, Column, Separator, Row } from '../components/base';
import { NavigationActions } from 'react-navigation';
import { TEAM } from './routes';
import * as LeaguesActions from '../redux/modules/leagues';

const width = Dimensions.get('window').width - 5 * 40 - 32;

class TableView extends Component {
  componentDidMount() {
    const id = this.props.navigation.state.params.id;

    if (!this.props.leagues[id].table) {
      this._getLeagues();
    }
  }

  _renderTeam(data) {
    return (
      <ListItem last onPress={() => this._onPress(data)}>
        <Column center fluid style={{ width: 20 }}>
          <Text bold>
            {data.position}
          </Text>
        </Column>
        <TeamLogo team={data} />
        <Column style={{ paddingLeft: 4, width }}>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {data.name}
          </Text>
        </Column>
        <Column center fluid style={{ width: 35 }}>
          <Text>
            {data.matches}
          </Text>
        </Column>
        <Column center fluid style={{ width: 40 }}>
          <Text>
            {data.set_points_diff}
          </Text>
        </Column>
        <Column center fluid style={{ width: 35 }}>
          <Text>
            {data.goals_diff}
          </Text>
        </Column>
        <Column center fluid style={{ width: 35 }}>
          <Text bold>
            {data.points}
          </Text>
        </Column>
      </ListItem>
    );
  }

  _onPress(team) {
    this.props.pushRoute({
      routeName: TEAM,
      params: { team, title: team.name },
    });
  }

  _getLeagues() {
    const id = this.props.navigation.state.params.id;

    this.props.getLeague(id);
  }

  render() {
    const { leagues } = this.props;
    const table = leagues[this.props.navigation.state.params.id].table || [];

    return (
      <View style={{ flex: 1 }}>
        <StaticListHeader>
          <Row center style={{ marginVertical: 8 }}>
            <Column center fluid style={{ width: 24 }} />
            <Column style={{ paddingLeft: 4, width }} />
            <Column center fluid style={{ width: 35 }}>
              <Text size={12} color="#fff">
                Sp.
              </Text>
            </Column>
            <Column center fluid style={{ width: 40 }}>
              <Text size={12} color="#fff">
                Sätze
              </Text>
            </Column>
            <Column center fluid style={{ width: 35 }}>
              <Text size={12} color="#fff">
                Tore
              </Text>
            </Column>
            <Column center fluid style={{ width: 35 }}>
              <Text bold size={12} color="#fff">
                Pkt.
              </Text>
            </Column>
          </Row>
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
