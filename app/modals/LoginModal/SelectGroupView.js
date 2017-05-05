import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getRankings } from '../../store/actions/leagueActions';
import { Container } from '../../components';
import { ListItem, Text } from '../../components/base';
import { NavigationActions } from 'react-navigation';
import NavCloseIcon from '../../Nav/NavCloseIcon';

class SelectGroupView extends Component {
  componentDidMount() {
    // console.tron.log(this.props.navigation.state.key)
    if (this.props.leagues.length === 0) {
      this.props.getRankings();
    }
  }

  render() {
    return (
      <Container
        error={this.props.error}
        refreshing={this.props.fetching}
        onRefresh={this.props.getRankings.bind(this)}
      >
        {this.props.leagues.length > 0 &&
          <ListItem.Group>
            {this.props.leagues.map((league, idx) => {
              if (!league.cup) {
                return (
                  <ListItem
                    key={league.id}
                    last={idx >= this.props.leagues.length - 2}
                    onPress={() => this.onPress(league)}
                  >
                    <Text>{league.name}</Text>
                  </ListItem>
                );
              }
            })}
          </ListItem.Group>}
      </Container>
    );
  }

  onPress(league) {
    this.props.navigate({
      routeName: 'SelectTeam',
      params: { id: league.id }
    });
  }
}


SelectGroupView.navigationOptions = {
  title: 'Gruppe wählen',
  header: NavCloseIcon
};

export default connect(
  state => ({
    error: state.loading.error,
    fetching: state.loading.nonBlocking,
    leagues: Object.values(state.leagues)
  }),
  dispatch => ({
    getRankings: () => dispatch(getRankings()),
    navigate: route => dispatch(NavigationActions.navigate(route))
  })
)(SelectGroupView);
