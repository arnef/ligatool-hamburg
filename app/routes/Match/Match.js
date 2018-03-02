import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import {
  MatchHeader,
  Container,
  SetItem,
  Button,
  Switch,
} from '../../components';
import * as MatchesActions from '../../redux/modules/matches';
import * as NavigationActions from '../../redux/modules/navigation';
import Routes from '../../config/routes';
import styles from './styles';
import S from '../../lib/strings';
import NoSets from './NoSets';
import ScoreModal from '../../modals/ScoreInput';
import {
  getFixture,
  getFixtureGame,
  getFixtureModus,
  getFixturePlayerHomeList,
  getFixturePlayerAwayList,
  getFixtureVenue,
  getFirstFixture,
  setFixtureGameResult,
  setFixtureModus,
  suggestFixtureResult,
  acceptFixtureResult,
} from '../../redux/modules/fixtures';
import { accessForTeams } from '../../redux/modules/user';

class Match extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scoreInput: -1,
      data: null,
    };

    this.onRefresh = this.onRefresh.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onToggleScoreInput = this.onToggleScoreInput.bind(this);
    this.onSave = this.onSave.bind(this);
    this.openPlayer = this.props.openPlayer.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  onRefresh() {
    this.props.getMatch(this.props.navigation.state.params.id);
  }

  onSelect(idx, data, value) {
    switch (value) {
      case 0:
        this.props.selectPlayer(data);
        break;
      case 1:
        this.onToggleScoreInput(idx, data);
        break;
    }
  }

  onToggleScoreInput(idx, data) {
    this.setState({
      scoreInput: this.state.scoreInput === idx ? -1 : idx,
      data: data,
    });
  }

  onSave(data, score) {
    this.props.setGameResult(score.gameNumber, {
      goalsHome: score.goalsHome,
      goalsAway: score.goalsAway,
    });
    this.setState({
      scoreInput: -1,
      data: null,
    });
    // TODO saga handle this
    // const match = this.props.matches[
    //   `${this.props.navigation.state.params.id}`
    // ];
    // console.log(data);
    // const sets = { ...match.sets };
    // const idx = data.gameNumbers[score.set];
    // const set = { ...data.sets[score.set] };

    // set.number = idx;
    // set.key = data.key;
    // set.result = {
    //   goalsHome: score.goalsHome,
    //   goalsAway: score.goalsAway,
    // };
    // // set.goals_home = score.goals_home;
    // // set.goals_away = score.goals_away;
    // if (!set.homePlayer1 && !set.awayPlayer1) {
    //   set.homePlayer1 = { id: 0 };
    //   set.homePlayer2 = { id: 0 };
    //   set.awayPlayer1 = { id: 0 };
    //   set.awayPlayer2 = { id: 0 };
    // }
    // sets[idx] = set;
    // this.props.updateSets(match.id, sets);
    // this.setState({ scoreInput: -1, data: null });
  }

  renderItem({ item, index }) {
    const { isAdmin, modus } = this.props;
    return (
      <View key={`game-${index}`}>
        {isAdmin &&
          item.toggle &&
          <View style={styles.containerToggle}>
            <Switch
              title={item.toggle.title}
              onValueChange={() => {
                this.props.setType(item.toggle.type, item.toggle.clear);
              }}
              value={modus.fixtureModus === item.toggle.active}
            />
          </View>}
        <SetItem
          data={item}
          fixtureId={this.props.match.id}
          index={index}
          openPlayer={this.openPlayer}
          editable={isAdmin}
          onSelect={this.onSelect}
        />
      </View>
    );
  }

  render() {
    const { match, modus, isAdmin, showButton } = this.props;
    return (
      <View style={styles.container}>
        <MatchHeader
          home={match.homeTeamName}
          away={match.awayTeamName}
          result={match.result}
          onPress={team => {
            if (team === 'home') {
              this.props.openTeam(match.homeTeamId, match.homeTeamName);
            } else if (team === 'away') {
              this.props.openTeam(match.awayTeamId, match.awayTeamName);
            }
          }}
        />
        {isAdmin &&
          <ScoreModal
            data={this.state.data}
            modus={modus}
            onCancel={() => this.onToggleScoreInput(-1, null)}
            getSet={this.props.getSet}
            onSave={this.onSave}
          />}
        <Container
          error={null}
          refreshing={this.props.loading}
          onRefresh={this.onRefresh}
          renderRow={this.renderItem}
          dataSource={
            match.status == 'SCHEDUELED' || match.status == 'POSTPONED'
              ? null
              : modus.lineUp[modus.fixtureModus]
          }
          keyExtractor={(item, idx) => `game-${idx}`}
          ListEmptyComponent={() =>
            <NoSets
              match={match}
              isAdmin={isAdmin}
              firstFixture={this.props.firstFixture}
              player={this.props.player}
              venue={this.props.venue}
            />}
        />
        {isAdmin &&
          showButton &&
          <Button
            onPress={() => {
              if (match.status === 'IN_PLAY') {
                this.props.suggestResult();
              } else if (match.status === 'FINISHED') {
                this.props.acceptResult();
              }
              // const match = this.props.matches[
              //   `${this.props.navigation.state.params.id}`
              // ];

              // this.props.suggestScore(match.id, match.sets);
            }}
            square
            title={
              S.SCORE_BUTTON_TEXT[
                this.props.actionRequired
                  ? match.status === 'IN_PLAY' ? 0 : 2
                  : 1
              ]
            }
            disabled={!this.props.actionRequired}
          />}
      </View>
    );
  }
}

function showButton(state, id) {
  const fixture = getFixture(state, id);
  const modus = getFixtureModus(state, id);

  if (modus.fixture < 0) {
    return (
      fixture.result &&
      fixture.result.setPointsHomeTeam + fixture.result.setPointsAwayTeam ===
        Math.abs(modus.fixture)
    );
  }

  return (
    fixture.result &&
    (fixture.result.setPointsHomeTeam >= modus.fixture ||
      fixture.result.setPointsAwayTeam >= modus.fixture)
  );
}

function isAdmin(state, id) {
  return (
    (accessForTeams(state).indexOf(getFixture(state, id).homeTeamId) !== -1 ||
      accessForTeams(state).indexOf(getFixture(state, id).awayTeamId) !== -1) &&
    getFixture(state, id).status !== 'CONFIRMED'
  );
}

export default connect(
  (state, props) => ({
    loading: state.loading.list,
    match: getFixture(state, props.navigation.state.params.id),
    modus: getFixtureModus(state, props.navigation.state.params.id),
    getSet: gameNumber =>
      getFixtureGame(state, props.navigation.state.params.id, gameNumber),
    player: {
      home: getFixturePlayerHomeList(state, props.navigation.state.params.id),
      away: getFixturePlayerAwayList(state, props.navigation.state.params.id),
    },
    venue: getFixtureVenue(state, props.navigation.state.params.id),
    firstFixture: getFirstFixture(state, props.navigation.state.params.id),
    showButton: showButton(state, props.navigation.state.params.id),
    isAdmin: isAdmin(state, props.navigation.state.params.id),
    actionRequired:
      accessForTeams(state).indexOf(
        getFixture(state, props.navigation.state.params.id).suggestingTeamId,
      ) === -1,
  }),
  (dispatch, props) => ({
    getMatch: id => dispatch(MatchesActions.getMatch(id)),
    openPlayer: player =>
      dispatch(
        NavigationActions.navigate({
          routeName: Routes.PLAYER,
          params: player,
        }),
      ),
    setGameResult: (gameNumber, result) =>
      dispatch(
        setFixtureGameResult(
          props.navigation.state.params.id,
          gameNumber,
          result,
        ),
      ),
    selectPlayer: data =>
      dispatch(
        NavigationActions.showPlayer(props.navigation.state.params.id, data),
      ),
    updateSets: (id, sets) => dispatch(MatchesActions.update({ id, sets })),
    // suggestScore: (id, sets) => dispatch(MatchesActions.suggest({ id, sets })),
    suggestResult: () =>
      dispatch(suggestFixtureResult(props.navigation.state.params.id)),
    acceptResult: () =>
      dispatch(acceptFixtureResult(props.navigation.state.params.id)),
    openTeam: (id, name) =>
      dispatch(
        NavigationActions.navigate({
          routeName: Routes.TEAM,
          params: { team: { id }, title: name },
        }),
      ),
    setType: (modus, resetGameNumbers) =>
      dispatch(
        setFixtureModus(
          props.navigation.state.params.id,
          modus,
          resetGameNumbers,
        ),
      ),
  }),
)(Match);
