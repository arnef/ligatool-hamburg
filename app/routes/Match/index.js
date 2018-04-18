import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import {
  MatchHeader,
  Content,
  SetItem,
  Button,
  Switch,
} from '../../components';
import * as MatchesActions from '../../redux/modules/matches';
import {
  showPlayer,
  navigate,
  getNavigationStateParams,
} from '../../redux/modules/navigation';
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
    this.onSelect = this.onSelect.bind(this);
    this.onToggleScoreInput = this.onToggleScoreInput.bind(this);
    this.onSave = this.onSave.bind(this);
    this.openPlayer = this.props.openPlayer.bind(this);
    this.renderItem = this.renderItem.bind(this);
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
  }

  renderItem({ item, index }) {
    const { isAdmin, modus } = this.props;
    return (
      <View key={`game-${index}`}>
        {isAdmin &&
          item.toggle && (
            <View style={styles.containerToggle}>
              <Switch
                title={item.toggle.title}
                onValueChange={() => {
                  this.props.setType(item.toggle.type, item.toggle.clear);
                }}
                value={modus.fixtureModus === item.toggle.active}
              />
            </View>
          )}
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
        {isAdmin && (
          <ScoreModal
            data={this.state.data}
            modus={modus}
            onCancel={() => this.onToggleScoreInput(-1, null)}
            getSet={this.props.getSet}
            onSave={this.onSave}
          />
        )}
        <Content
          onRefresh={this.props.getMatch}
          renderItem={this.renderItem}
          data={
            !modus
              ? null
              : match.status == 'SCHEDUELED' || match.status == 'POSTPONED'
                ? []
                : modus.lineUp[modus.fixtureModus]
          }
          ListEmptyComponent={
            <NoSets
              match={match}
              isAdmin={isAdmin}
              firstFixture={this.props.firstFixture}
              player={this.props.player}
              venue={this.props.venue}
            />
          }
        />
        {isAdmin &&
          showButton && (
            <Button
              onPress={() => {
                if (match.status === 'IN_PLAY') {
                  this.props.suggestResult();
                } else if (match.status === 'FINISHED') {
                  this.props.acceptResult();
                }
              }}
              square
              title={
                S.SCORE_BUTTON_TEXT[
                  match.status === 'IN_PLAY'
                    ? 0
                    : this.props.actionRequired ? 2 : 1
                ]
              }
              disabled={
                !(match.status === 'IN_PLAY' || this.props.actionRequired)
              }
            />
          )}
      </View>
    );
  }
}

function showButton(state, id) {
  const fixture = getFixture(state, id);
  const modus = getFixtureModus(state, id);
  if (!modus || !fixture.suggestingTeamId) {
    return false;
  }
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
    match: getFixture(state, getNavigationStateParams(props.navigation).id),
    modus: getFixtureModus(
      state,
      getNavigationStateParams(props.navigation).id,
    ),
    getSet: gameNumber =>
      getFixtureGame(
        state,
        getNavigationStateParams(props.navigation).id,
        gameNumber,
      ),
    player: {
      home: getFixturePlayerHomeList(
        state,
        getNavigationStateParams(props.navigation).id,
      ),
      away: getFixturePlayerAwayList(
        state,
        getNavigationStateParams(props.navigation).id,
      ),
    },
    venue: getFixtureVenue(
      state,
      getNavigationStateParams(props.navigation).id,
    ),
    firstFixture: getFirstFixture(
      state,
      getNavigationStateParams(props.navigation).id,
    ),
    showButton: showButton(
      state,
      getNavigationStateParams(props.navigation).id,
    ),
    isAdmin: isAdmin(state, getNavigationStateParams(props.navigation).id),
    actionRequired:
      accessForTeams(state).indexOf(
        getFixture(state, getNavigationStateParams(props.navigation).id)
          .suggestingTeamId,
      ) === -1,
  }),
  (dispatch, props) => ({
    getMatch: () =>
      dispatch(
        MatchesActions.getMatch(getNavigationStateParams(props.navigation).id),
      ),
    openPlayer: player =>
      dispatch(
        navigate({
          routeName: Routes.PLAYER,
          params: player,
        }),
      ),
    setGameResult: (gameNumber, result) =>
      dispatch(
        setFixtureGameResult(
          getNavigationStateParams(props.navigation).id,
          gameNumber,
          result,
        ),
      ),
    selectPlayer: data =>
      dispatch(showPlayer(getNavigationStateParams(props.navigation).id, data)),
    updateSets: (id, sets) => dispatch(MatchesActions.update({ id, sets })),
    // suggestScore: (id, sets) => dispatch(MatchesActions.suggest({ id, sets })),
    suggestResult: () =>
      dispatch(
        suggestFixtureResult(getNavigationStateParams(props.navigation).id),
      ),
    acceptResult: () =>
      dispatch(
        acceptFixtureResult(getNavigationStateParams(props.navigation).id),
      ),
    openTeam: (id, name) =>
      dispatch(
        navigate({
          routeName: Routes.TEAM,
          params: { team: { id }, title: name },
        }),
      ),
    setType: (modus, resetGameNumbers) =>
      dispatch(
        setFixtureModus(
          getNavigationStateParams(props.navigation).id,
          modus,
          resetGameNumbers,
        ),
      ),
  }),
)(Match);
