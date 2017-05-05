import React, { Component } from 'react';
import { Container } from '../../components';
import { connect } from 'react-redux';
import actions from '../../store/actions';
import { ListItem, Text } from '../../components/base';
import { NavigationActions } from 'react-navigation';

class SelectTeamView extends Component {
  componentDidMount() {
    const id = this.props.navigation.state.params.id;

    if (!this.props.leagues[id].table) {
      this.getTeams();
    }
    // console.tron.log(this.props.navigation)
  }

  render() {
    const lid = this.props.navigation.state.params.id;
    console.log(this.props.leagues[lid]);
    const teams = this.props.leagues[lid].table
      ? JSON.parse(JSON.stringify(this.props.leagues[lid].table))
      : [];

    // sort teams alphabetically
    teams.sort((a, b) => {
      return a.name < b.name ? -1 : 1;
    });

    return (
      <Container
        error={this.props.error}
        refreshing={this.props.fetching}
        onRefresh={this.getTeams.bind(this)}
      >
        {teams.length > 0 &&
          <ListItem.Group>
            {teams.map((team, idx) => {
              return (
                <ListItem
                  onPress={() => {
                    this.onPress(team);
                  }}
                  key={team.id}
                  last={idx === teams.length - 1}
                  icon={true}
                >
                  {team.image && <ListItem.Image url={team.image} />}
                  {!team.image && <ListItem.Icon name="shirt" />}
                  <Text>{team.name}</Text>
                </ListItem>
              );
            })}
          </ListItem.Group>}
      </Container>
    );
  }

  getTeams() {
    const lid = this.props.navigation.state.params.id;
    this.props.getLeague(lid);
  }

  onPress(team) {
    this.props.setUserTeam(team);
    this.props.navigate({
      routeName: 'LoginView'
    });
    // this.props.navigator.push({ state: MODAL_LOGIN, title: 'Login' })
  }
}

SelectTeamView.navigationOptions = {
  title: 'Team wählen'
};

export default connect(
  state => ({
    error: state.loading.error,
    fetching: state.loading.nonBlocking,
    leagues: state.leagues
  }),
  dispatch => ({
    getLeague: id => dispatch(actions.getLeague(id)),
    setUserTeam: team => dispatch(actions.setUserTeam(team)),
    navigate: route => dispatch(NavigationActions.navigate(route))
  })
)(SelectTeamView);
