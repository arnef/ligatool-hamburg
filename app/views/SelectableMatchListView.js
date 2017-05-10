import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../store/actions';
import { ListItem, Text } from '../components/base';
import { Container, MatchItem } from '../components';
import { NavigationActions } from 'react-navigation';
import { sortMatches } from '../Helper';

class SelectableMatchListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMatchDay: null,
      showDropdown: false
    };
  }

  componentDidMount() {
    const id = this.props.navigation.state.params.id;
    if (!this.props.leagues[id] || !this.props.leagues[id].match_days) {
      this.props.getLeagueMatches(id);
    }
  }

  render() {
    const { matches, leagues } = this.props;
    const { showDropdown, selectedMatchDay } = this.state;
    const id = this.props.navigation.state.params.id;
    const league = leagues[id];
    const matchDays = league.match_days || {};
    const matchDayKeys = Object.keys(matchDays);
    const matchList = matchDays[selectedMatchDay || league.selected] || [];

    matchList.sort(sortMatches(matches));

    return (
      <Container
        refreshing={this.props.loading}
        onRefresh={() => this.props.getLeagueMatches(id)}
        getRef={container => (this.container = container)}
      >
        {matchDayKeys.length > 0 &&
          <ListItem.Group>
            <ListItem.Header
              hideSeparator={!showDropdown}
              menuOpen={showDropdown}
              title="Spieltag wählen"
              toggleMenu={this.onPress.bind(this)}
            >
              {selectedMatchDay || league.selected}
            </ListItem.Header>
            {showDropdown &&
              matchDayKeys.map((matchday: string, idx: number) => (
                <ListItem
                  key={idx}
                  onPress={() => this.onSelectMatchDay(matchday)}
                  last={idx === matchDayKeys.length - 1}
                >
                  <Text>{matchday}</Text>
                </ListItem>
              ))}
          </ListItem.Group>}
        {!showDropdown &&
          matchList.map(matchId => (
              <MatchItem key={matchId} data={matches[matchId]} />
            ))}
      </Container>
    );
  }

  onSelectMatchDay(matchDay) {
    this.setState({ selectedMatchDay: matchDay, showDropdown: false });
    if (this.container && this.container.scrollTo) {
      this.container.scrollTo({ animated: true, x: 0, y: 0 });
    }
  }

  onPress() {
    this.setState({ showDropdown: !this.state.showDropdown });
  }
}

export default connect(
  state => ({
    loading: state.loading.nonBlocking,
    leagues: state.leagues,
    matches: state.matches
  }),
  dispatch => ({
    getLeagueMatches: id => dispatch(actions.getLeagueMatches(id)),
    pushRoute: route => dispatch(NavigationActions.navigate(route))
  })
)(SelectableMatchListView);
