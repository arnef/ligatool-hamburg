/**
 * Copyright (C) 2018 Arne Feil
 *
 * This file is part of DTFB App.
 *
 * DTFB App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DTFB App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DTFB App.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import * as React from 'react';
import { View } from 'react-native';
import { connect, Dispatch } from 'react-redux';
import styles from './styles';
import {
  MatchHeader,
  Content,
  Switch,
  SetItem,
  Button,
  ScoreInput,
} from '../../../../components';
import { Strings } from '../../../../lib/strings';
import {
  getFixture,
  getFixtureModus,
  getFirstFixture,
  getFixturePlayerHomeList,
  getFixturePlayerAwayList,
  getFixtureVenue,
  setFixtureModus,
  suggestFixtureResult,
  acceptFixtureResult,
  setFixtureStatusInPlay,
  getFixtureGame,
  setFixtureGameResult,
} from '@app/redux/modules/fixtures';
import {
  getNavigationStateParams,
  showPlayer,
  navigate,
} from '@app/redux/modules/navigation';
import { accessForTeams, getColor } from '@app/redux/modules/user';
import { Routes } from '@app/scenes/routes';
import { NoSets } from './components/no-sets';
import { getMatch } from '../../../../redux/modules/matches';

interface Props extends StateProps, DispatchProps {
  navigation: any;
}
interface State {
  scoreInput: number;
  data: any;
}

class Fixture extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scoreInput: -1,
      data: null,
    };
  }

  private onPressTeam = (team: string) => {
    const { match } = this.props;
    if (team === 'home') {
      this.props.openTeam(match.homeTeamId, match.homeTeamName);
    } else if (team === 'away') {
      this.props.openTeam(match.awayTeamId, match.awayTeamName);
    }
  };

  private onToggleType = (toggle: any) => () => {
    this.props.setType(toggle.type, toggle.clear);
  };

  private onOpenPlayer = (player: any) => {
    this.props.navigate(Routes.playerDetails, player);
  };

  private onToggleScoreInput = (idx: number, data: any) => () => {
    this.setState({
      scoreInput: this.state.scoreInput === idx ? -1 : idx,
      data: data,
    });
  };

  private onSelect = (idx: number, data: any, value: number) => () => {
    switch (value) {
      case 0:
        this.props.selectPlayer(data);
        break;
      case 1:
        this.onToggleScoreInput(idx, data)();
        break;
    }
  };

  private onPressButton = () => {
    if (this.props.match.status === 'IN_PLAY') {
      this.props.suggestResult();
    } else if (this.props.match.status === 'FINISHED') {
      this.props.acceptResult();
    }
  };

  private onSaveResult = (data: any, score: any) => {
    this.props.setGameResult(score.gameNumber, {
      goalsHome: score.goalsHome,
      goalsAway: score.goalsAway,
    });
    setTimeout(() => {
      this.setState({
        scoreInput: -1,
        data: null,
      });
    }, 100);
  };

  private renderItem = ({ item, index }: any) => {
    const { isAdmin, modus, match } = this.props;

    return (
      <View key={`game-${index}`}>
        {isAdmin &&
          item.toggle && (
            <View style={styles.containerToggle}>
              <Switch
                title={item.toggle.title}
                onValueChange={this.onToggleType(item.toggle)}
                value={modus.fixtureModus === item.toggle.active}
              />
            </View>
          )}
        <SetItem
          data={item}
          fixtureId={match.id}
          index={index}
          openPlayer={this.onOpenPlayer}
          editable={isAdmin}
          onSelect={this.onSelect}
        />
      </View>
    );
  };

  public render() {
    const { match, isAdmin, modus, showButton, actionRequired } = this.props;
    return (
      <View style={styles.container}>
        <MatchHeader
          home={match.homeTeamName}
          away={match.awayTeamName}
          result={match.result}
          onPress={this.onPressTeam}
        />
        {isAdmin && (
          <ScoreInput
            data={this.state.data}
            modus={modus}
            onCancel={this.onToggleScoreInput(-1, null)}
            getSet={this.props.getSet}
            onSave={this.onSaveResult}
            loading={this.props.loading}
            color={this.props.color}
          />
        )}
        <Content
          onRefresh={this.props.getMatch}
          renderItem={this.renderItem}
          data={
            !modus
              ? null
              : match.status === 'SCHEDUELED' || match.status === 'POSTPONED'
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
              color={this.props.color}
              insertResult={this.props.insertResult}
              navigate={this.props.navigate}
            />
          }
        />
        {isAdmin &&
          showButton && (
            <Button
              onPress={this.onPressButton}
              square
              title={
                Strings.SCORE_BUTTON_TEXT[
                  match.status === 'IN_PLAY' ? 0 : actionRequired ? 2 : 1
                ]
              }
              disabled={!(match.stauts === 'IN_PLAY' || actionRequired)}
            />
          )}
      </View>
    );
  }
}

interface StateProps {
  loading: boolean;
  match: any;
  isAdmin: boolean;
  modus: any;
  showButton: boolean;
  actionRequired: boolean;
  firstFixture: boolean;
  player: any;
  venue: any;
  color: string;
  getSet: Function;
}

interface DispatchProps {
  selectPlayer: Function;
  openTeam: Function;
  getMatch: Function;
  setType: Function;
  suggestResult: Function;
  acceptResult: Function;
  insertResult: Function;
  navigate: Function;
  setGameResult: Function;
}

function mapStateToProps(state: any, props: Props): StateProps {
  const fixtureId = getNavigationStateParams(props.navigation).id;
  const fixture = getFixture(state, fixtureId);
  const fixtureModus = getFixtureModus(state, fixtureId);
  const isAdmin =
    (accessForTeams(state).indexOf(fixture.homeTeamId) !== -1 ||
      accessForTeams(state).indexOf(fixture.awayTeamId) !== -1) &&
    fixture.status !== 'CONFIRMED';

  const getShowButton = () => {
    if (!fixtureModus || !fixture.suggestingTeamId) {
      return false;
    }
    if (fixtureModus.fixture < 0) {
      return (
        fixture.result &&
        fixture.result.setPointsHomeTeam + fixture.result.setPointsAwayTeam ===
          Math.abs(fixtureModus.fixutre)
      );
    }

    return (
      fixture.result &&
      (fixture.result.setPointsHomeTeam >= fixtureModus.fixture ||
        fixture.result.setPointsAwayTeam >= fixtureModus.fixture)
    );
  };
  return {
    loading: state.loading.modal,
    match: fixture,
    isAdmin: isAdmin,
    modus: fixtureModus,
    showButton: getShowButton(),
    actionRequired:
      accessForTeams(state).indexOf(fixture.suggestingTeamId) === -1,
    firstFixture: getFirstFixture(state, fixtureId),
    player: {
      home: getFixturePlayerHomeList(state, fixtureId),
      away: getFixturePlayerAwayList(state, fixtureId),
    },
    venue: getFixtureVenue(state, fixtureId),
    color: getColor(state),
    getSet: (gameNumber: string) =>
      getFixtureGame(state, fixtureId, gameNumber),
  };
}

function mapDispatchToProps(
  dispatch: Dispatch<any>,
  props: Props,
): DispatchProps {
  const fixtureId = getNavigationStateParams(props.navigation).id;
  return {
    selectPlayer: (data: any) => dispatch(showPlayer(fixtureId, data)),
    openTeam: (id: string, name: string) =>
      dispatch(
        navigate({
          routeName: Routes.teamDetails,
          params: { team: { id }, title: name },
        }),
      ),
    getMatch: () => dispatch(getMatch(fixtureId)),
    setType: (modus: any, resetGameNumbers: any) =>
      dispatch(setFixtureModus(fixtureId, modus, resetGameNumbers)),
    suggestResult: () => dispatch(suggestFixtureResult(fixtureId)),
    acceptResult: () => dispatch(acceptFixtureResult(fixtureId)),
    insertResult: () => dispatch(setFixtureStatusInPlay(fixtureId)),
    navigate: (routeName: string, params: any) =>
      dispatch(navigate({ routeName, params })),
    setGameResult: (gameNumber: string, result: any) =>
      dispatch(setFixtureGameResult(fixtureId, gameNumber, result)),
  };
}

export const FixtureDetails = connect(mapStateToProps, mapDispatchToProps)(
  Fixture,
);
