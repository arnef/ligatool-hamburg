import React, { Component } from 'react';
import { View, Keyboard, Dimensions, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import actions from '../../store/actions';
import { Container, Match, StaticListHeader } from '../../components';
import {
  Button,
  Row,
  ActionSheet,
  Content,
  Touchable,
  Text,
} from '../../components/base';
import * as theme from '../../components/base/theme';
import { PLAYER } from '../routes';
const height = Dimensions.get('window').height;

class SetsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboardSpace: 0,
      menuOpen: -1,
      offsetY: 0,
      py: 0,
      scoreInput: -1,
    };
  }

  componentDidMount() {
    if (!this.props.loading) {
      this.getMatch();
    }
    if (!this.keyboardDidShowListener) {
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this.keyboardDidShow.bind(this),
      );
    }
  }
  componentWillUnmount() {
    if (this.keyboardDidShowListener) {
      this.keyboardDidShowListener.remove();
    }
  }

  scrollToInput() {
    const visibleHeight = height - this.state.keyboardSpace - 100;
    const keyboardDistance = this.state.py - visibleHeight;

    if (keyboardDistance > 0) {
      this.scrollView.scrollTo({
        animated: true,
        x: 0,
        y: this.state.offsetY + keyboardDistance,
      });
      this.setState({ py: this.state.py - keyboardDistance });
    }
  }

  keyboardDidShow(frames) {
    if (!frames.endCoordinates) {
      return;
    }
    if (this.state.keyboardSpace === 0) {
      this.setState({ keyboardSpace: frames.endCoordinates.height });
      this.scrollToInput();
    }
  }

  toggleMenu(idx) {
    if (this.state.scoreInput !== idx) {
      ActionSheet.show(
        {
          options: ['Spieler wählen', 'Ergebnis eintragen', 'Abbrechen'],
          cancelButtonIndex: 2,
        },
        val => {
          if (val === 0) {
          }
          if (val === 1) {
            this.toggleScoreInput(idx);
          }
        },
      );
    }
    this.setState({ scoreInput: -1 });
  }

  getMatch() {
    this.props.getMatch(this.props.data.id);
  }

  onPress(data, idx) {
    if (data.sets[0].player_1_home && data.sets[0].player_1_away) {
      this.toggleScoreInput(idx);
    } else {
      this.props.showPlayerDialog(this.props.data.id, data);
    }
  }

  openPlayer(player) {
    this.props.navigate(PLAYER, player);
  }

  onSelect(idx, data, value) {
    // this.toggleMenu(-1);
    if (value === 0) {
      this.props.showPlayerDialog(this.props.data.id, data);
    }
    if (value === 1) {
      this.setState({ scoreInput: idx });
    }
    if (value === 2) {
      this.props.resetSets(this.props.data.id, data.setsIdx);
      // alert(JSON.stringify(data));
    }
  }

  onSave(data, score) {
    const match = this.props.matches[this.props.data.id];
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
    this.props.updateSets(this.props.data.id, sets);
    this.setState({ scoreInput: -1 });
  }

  toggleScoreInput(idx) {
    if (this.state.scoreInput === idx) {
      this.setState({ menuOpen: -1, scoreInput: -1 });
    } else {
      this.setState({ menuOpen: -1, scoreInput: idx });
    }
  }

  onScroll(event) {
    const offsetY = event.nativeEvent.contentOffset.y;

    this.setState({ offsetY });
  }

  adjustPosition(py) {
    this.setState({ py });
    if (this.state.keyboardSpace > 0) {
      this.scrollToInput();
    }
  }

  render() {
    const data = this.props.matches[this.props.data.id] || {};
    const editable = data.is_admin && data.type;

    return (
      <View style={{ backgroundColor: theme.backgroundColor, flex: 1 }}>
        <Match.Header matchId={this.props.data.id} />
        {data.showButton && this.renderSubmitButton()}
        <Container
          getRef={scrollView => {
            this.scrollView = scrollView;
          }}
          onScroll={this.onScroll.bind(this)}
          error={this.props.error}
          refreshing={this.props.loading}
          onRefresh={this.getMatch.bind(this)}
        >
          <Match
            editable={editable}
            match={data}
            toggleMatchType={this.props.toggleMatchType.bind(this)}
            onPress={this.onPress.bind(this)}
            openPlayer={this.openPlayer.bind(this)}
            scoreInput={this.state.scoreInput}
            toggleMenu={this.toggleMenu.bind(this)}
            menuOpen={this.state.menuOpen}
            onSave={this.onSave.bind(this)}
            adjustPosition={this.adjustPosition.bind(this)}
            onSelect={this.onSelect.bind(this)}
          />
        </Container>

      </View>
    );
  }

  renderSubmitButton() {
    const match = this.props.matches[this.props.data.id] || {};

    const idx = match.live
      ? 0
      : this.props.auth.team.ids.indexOf(match.score_suggest) !== -1 ? 1 : 2;
    const disabled = this.props.loading || idx === 1;
    const Wrap = disabled ? View : Touchable;

    return (
      <StaticListHeader style={{ paddingVertical: 12, paddingHorizontal: 12 }}>
        <Wrap
          style={{ opacity: disabled ? 0.6 : 1 }}
          onPress={() => {
            this.props.suggestScore(match.id, match.sets, idx);
          }}
        >
          <Text color="#fff" center>{`${btnText[idx]}`}</Text>
        </Wrap>
      </StaticListHeader>
    );
  }
}

const styles = StyleSheet.create({
  submitRow: {
    // position: 'absolute',
    // bottom: 0,
    // width: Dimensions.get('window').width,
    paddingHorizontal: 8,
    paddingVertical: 8,
    // borderTopWidth: StyleSheet.hairlineWidth,
    // borderTopColor: 'rgba(0, 0, 0, .2)',
    // backgroundColor: Platform.OS === 'ios'
    //   ? 'rgba(244, 244, 244, .9)'
    //   : 'rgba(221, 221, 221, .9)',
    // zIndex: 99,
  },
});

const btnText = [
  'Ergebnis vorschlagen',
  'Ergebnis vorgeschlagen',
  'Ergebnis akzeptieren',
];

export default connect(
  state => ({
    loading: state.loading.nonBlocking,
    error: state.loading.error,
    auth: state.auth,
    matches: state.matches,
  }),
  dispatch => ({
    getMatch: id => dispatch(actions.getMatch(id)),
    hidePlayerDialog: () => dispatch(actions.hidePlayerDialog()),
    setPlayer: (team, result, setsIdx) =>
      dispatch(actions.setPlayer(team, result, setsIdx)),
    showPlayerDialog: (id, data) =>
      dispatch(actions.showPlayerDialog(id, data)),
    suggestScore: (id, sets, btnIdx) =>
      dispatch(actions.suggestScore(id, sets, btnIdx)),
    toggleMatchType: (id, setsIdx, type) =>
      dispatch(actions.toggleMatchType(id, setsIdx, type)),
    updateSets: (id, sets) => dispatch(actions.updateSets(id, sets)),
    navigate: (routeName, params) =>
      dispatch(NavigationActions.navigate({ routeName, params })),
    resetSets: (matchId, setsIdx) =>
      dispatch(actions.resetSets(matchId, setsIdx)),
  }),
)(SetsView);
