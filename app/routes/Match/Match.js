// @flow
import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import {
  MatchHeader,
  Container,
  SetItem,
  Button,
  Text,
  Switch,
} from '../../components';
import * as MatchesActions from '../../redux/modules/matches';
import * as NavigationActions from '../../redux/modules/navigation';
import Routes from '../../config/routes';
import styles from './styles';
import S from '../../lib/strings';
import NoSets from './NoSets';
import ScoreModal from '../../modals/ScoreInput';

class Match extends React.Component {
  state: {
    scoreInput: number,
  };
  onRefresh: Function;
  onSelect: Function;
  onToggleScoreInput: Function;
  onSave: Function;
  openPlayer: Function;
  renderItem: Function;

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
    const matchId = `${this.props.navigation.state.params.id}`;
    switch (value) {
      case 0:
        this.props.selectPlayer(matchId, data);
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
    // TODO saga handle this
    const match = this.props.matches[
      `${this.props.navigation.state.params.id}`
    ];
    const sets = { ...match.sets };
    const idx = data.setsIdx[score.set];
    const set = { ...data.sets[score.set] };

    set.number = idx;
    set.goals_home = score.goals_home;
    set.goals_away = score.goals_away;
    if (!set.player_1_home && !set.player_1_away) {
      set.player_1_home = { id: 0 };
      set.player_2_home = { id: 0 };
      set.player_1_away = { id: 0 };
      set.player_2_away = { id: 0 };
    }
    sets[idx] = set;
    this.props.updateSets(match.id, sets);
    this.setState({ scoreInput: -1, data: null });
  }

  renderItem({ item, index }) {
    return (
      <View key={`game-${index}`}>
        {item.halftime &&
          <View style={styles.containerHalftime}>
            <View style={styles.separator} />
            <Text style={styles.halftime} bold secondary>
              {S.SECOND_HALFTIME}
            </Text>
            <View style={styles.separator} />
          </View>}
        {item.editable &&
          item.toggle &&
          <View style={styles.containerToggle}>
            <Switch
              title={item.toggle.title}
              onValueChange={() => {
                this.props.setType(
                  this.props.navigation.state.params.id,
                  item.setsIdx,
                  item.toggle.type,
                );
              }}
              value={
                this.props.matches[
                  `${this.props.navigation.state.params.id}`
                ].type.indexOf('d5') !== -1
              }
            />
          </View>}
        <SetItem
          data={item}
          index={index}
          openPlayer={this.openPlayer}
          editable={item.editable}
          onSelect={this.onSelect}
        />
      </View>
    );
  }

  render() {
    const match: Match =
      this.props.matches[`${this.props.navigation.state.params.id}`] || {};

    return (
      <View style={styles.container}>
        <MatchHeader
          home={match.team_home ? match.team_home.name : ''}
          away={match.team_away ? match.team_away.name : ''}
          points={match.set_points}
          goals={match.goals}
          onPress={(team: string) => {
            this.props.openTeam(match[team]);
          }}
        />
        {match.is_admin &&
          <ScoreModal
            data={this.state.data}
            onCancel={() => this.onToggleScoreInput(-1, null)}
            onSave={this.onSave}
          />}
        <Container
          error={null}
          refreshing={this.props.loading}
          onRefresh={this.onRefresh}
          renderRow={this.renderItem}
          dataSource={match.games}
          keyExtractor={(item, idx) => `game-${idx}`}
          ListEmptyComponent={() => {
            return match && match.sets ? <NoSets match={match} /> : <View />;
          }}
        />
        {match.is_admin &&
          match.state > -1 &&
          <Button
            onPress={() => {
              const match = this.props.matches[
                `${this.props.navigation.state.params.id}`
              ];

              this.props.suggestScore(match.id, match.sets);
            }}
            square
            title={S.SCORE_BUTTON_TEXT[match.state]}
            disabled={match.state === 1}
          />}
      </View>
    );
  }
}

export default connect(
  state => ({
    loading: state.loading.list,
    matches: state.matches,
  }),
  (dispatch: Dispatch<any>) => ({
    getMatch: (id: number) => dispatch(MatchesActions.getMatch(id)),
    openPlayer: player =>
      dispatch(
        NavigationActions.navigate({
          routeName: Routes.PLAYER,
          params: player,
        }),
      ),
    selectPlayer: (id, data) =>
      dispatch(NavigationActions.showPlayer(id, data)),
    updateSets: (id, sets) => dispatch(MatchesActions.update({ id, sets })),
    suggestScore: (id, sets) => dispatch(MatchesActions.suggest({ id, sets })),
    openTeam: team =>
      dispatch(
        NavigationActions.navigate({
          routeName: Routes.TEAM,
          params: { team, title: team.name },
        }),
      ),
    setType: (id: number, setsIdx: Array<number>, type: string) =>
      dispatch(MatchesActions.setType({ id, setsIdx, type })),
  }),
)(Match);
