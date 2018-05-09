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

import {
  Button,
  Content,
  MatchHeader,
  ScoreInput,
  SetItem,
  Switch,
} from '@app/components';
import { Strings } from '@app/lib/strings';
import {
  acceptFixtureResult,
  getFirstFixture,
  getFixture,
  getFixtureGame,
  getFixtureModus,
  getFixturePlayerAwayList,
  getFixturePlayerHomeList,
  getFixtureVenue,
  setFixtureGameResult,
  setFixtureModus,
  setFixtureStatusInPlay,
  suggestFixtureResult,
} from '@app/redux/modules/fixtures';
import { getMatch } from '@app/redux/modules/matches';
import {
  getNavigationStateParams,
  navigate,
  showPlayer,
} from '@app/redux/modules/navigation';
import { accessForTeams, getColor } from '@app/redux/modules/user';
import { Routes } from '@app/scenes/routes';
import * as React from 'react';
import { View } from 'react-native';
import { connect, Dispatch } from 'react-redux';

import { NoSets } from './components/no-sets';
import styles from './styles';

interface IProps extends IStateProps, IDispatchProps {
  navigation: any;
}
interface IState {
  scoreInput: number;
  data: any;
}

class Fixture extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      data: null,
      scoreInput: -1,
    };
  }

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
              disabled={!(match.status === 'IN_PLAY' || actionRequired)}
            />
          )}
      </View>
    );
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
      data,
      scoreInput: this.state.scoreInput === idx ? -1 : idx,
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

  private onSaveResult = (_: any, score: any) => {
    this.props.setGameResult(score.gameNumber, {
      goalsAway: score.goalsAway,
      goalsHome: score.goalsHome,
    });
    setTimeout(() => {
      this.setState({
        data: null,
        scoreInput: -1,
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
          getSet={this.props.getSet}
          openPlayer={this.onOpenPlayer}
          editable={isAdmin}
          onSelect={this.onSelect}
        />
      </View>
    );
  };
}

interface IStateProps {
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
  getSet: (gameNumber: string) => any;
}

interface IDispatchProps {
  selectPlayer: (data: any) => void;
  openTeam: (id: string, name: string) => void;
  getMatch: () => void;
  setType: (modus: any, resetGameNumbers: any) => void;
  suggestResult: () => void;
  acceptResult: () => void;
  insertResult: () => void;
  navigate: (routeName: string, params: any) => void;
  setGameResult: (gameNumber: string, result: any) => void;
}

function mapStateToProps(state: any, props: IProps): IStateProps {
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
          Math.abs(fixtureModus.fixture)
      );
    }

    return (
      fixture.result &&
      (fixture.result.setPointsHomeTeam >= fixtureModus.fixture ||
        fixture.result.setPointsAwayTeam >= fixtureModus.fixture)
    );
  };
  return {
    actionRequired:
      accessForTeams(state).indexOf(fixture.suggestingTeamId) === -1,
    color: getColor(state),
    firstFixture: getFirstFixture(state, fixtureId),
    getSet: (gameNumber: string) =>
      getFixtureGame(state, fixtureId, gameNumber),
    isAdmin,
    loading: state.loading.modal,
    match: fixture,
    modus: fixtureModus,
    player: {
      away: getFixturePlayerAwayList(state, fixtureId),
      home: getFixturePlayerHomeList(state, fixtureId),
    },
    showButton: getShowButton(),
    venue: getFixtureVenue(state, fixtureId),
  };
}

function mapDispatchToProps(
  dispatch: Dispatch<any>,
  props: IProps,
): IDispatchProps {
  const fixtureId = getNavigationStateParams(props.navigation).id;
  return {
    acceptResult: () => dispatch(acceptFixtureResult(fixtureId)),
    getMatch: () => dispatch(getMatch(fixtureId)),
    insertResult: () => dispatch(setFixtureStatusInPlay(fixtureId)),
    navigate: (routeName: string, params: any) =>
      dispatch(navigate({ routeName, params })),
    openTeam: (id: string, name: string) =>
      dispatch(
        navigate({
          params: { team: { id }, title: name },
          routeName: Routes.teamDetails,
        }),
      ),
    selectPlayer: (data: any) => dispatch(showPlayer(fixtureId, data)),
    setGameResult: (gameNumber: string, result: any) =>
      dispatch(setFixtureGameResult(fixtureId, gameNumber, result)),
    setType: (modus: any, resetGameNumbers: any) =>
      dispatch(setFixtureModus(fixtureId, modus, resetGameNumbers)),
    suggestResult: () => dispatch(suggestFixtureResult(fixtureId)),
  };
}

export const FixtureDetails = connect(mapStateToProps, mapDispatchToProps)(
  Fixture,
);
