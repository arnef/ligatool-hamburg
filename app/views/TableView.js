import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { connect } from 'react-redux';
import actions from '../store/actions';
import { Container, TeamLogo } from '../components';
import { Text, ListItem, Column } from '../components/base';
import { NavigationActions } from 'react-navigation';
import { TEAM } from './routes';

const width = Dimensions.get('window').width - (5*40) - 32;

class TableView extends Component {
  componentDidMount() {
    const id = this.props.navigation.state.params.id;

    if (!this.props.leagues[id].table) {
      this._getLeagues();
    }
  }

  _renderTeam(data, idx, last) {
    return (
      <ListItem
        last={last}
        key={idx}
        maxHeight={idx === -1 ? 30 : 0}
        onPress={
          idx !== -1
            ? () => {
                this._onPress(data);
              }
            : null
        }
      >
        <Column center fluid style={{ width: 24 }}>
          <Text bold>{data.position}</Text>
        </Column>
        {idx !== -1 && <TeamLogo team={data} />}
        <Column style={{ paddingLeft: 4, width }}>
          <Text numberOfLines={1} ellipsizeMode='tail'>{data.name}</Text>
        </Column>
        <Column center fluid style={{ width: 35 }}>
          <Text>{data.matches}</Text>
        </Column>
        <Column center fluid style={{ width: 40 }}>
          <Text>{data.set_points_diff}</Text>
        </Column>
        <Column center fluid style={{ width: 35 }}>
          <Text>{data.goals_diff}</Text>
        </Column>
        <Column center fluid style={{ width: 35 }}>
          <Text bold>{data.points}</Text>
        </Column>
      </ListItem>
    );
  }

  _onPress(team) {
    this.props.pushRoute({
      routeName: TEAM,
      params: { team, title: team.name }
    });
  }

  _getLeagues() {
    const id = this.props.navigation.state.params.id;

    this.props.getLeague(id);
  }

  render() {
    const { leagues } = this.props;
    const id = this.props.navigation.state.params.id;
    const table = leagues[id].table || [];

    return (
      <Container
        error={this.props.error}
        refreshing={this.props.loading}
        onRefresh={this._getLeagues.bind(this)}
      >
        {table.length > 0 &&
          <ListItem.Group>
            {this._renderTeam(
              {
                goals_diff: 'Tore',
                matches: 'Sp.',
                points: 'Pkt.',
                position: '',
                set_points_diff: 'Sätze',
                team: ''
              },
              -1
            )}
            {table.map((team, idx) => {
              return this._renderTeam(team, idx, idx === table.length - 1);
            })}
          </ListItem.Group>}
      </Container>
    );
  }
}

export default connect(
  state => ({
    error: state.loading.error,
    loading: state.loading.nonBlocking,
    leagues: state.leagues
  }),
  dispatch => ({
    getLeague: id => dispatch(actions.getLeague(id)),
    pushRoute: route => dispatch(NavigationActions.navigate(route))
  })
)(TableView);
