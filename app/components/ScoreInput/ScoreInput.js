// @flow
import React from 'react';
import { View, TextInput, Platform } from 'react-native';
import Card from '../Card';
import Touchable from '../Touchable';
import Text from '../Text';
import Icon from '../Icon';
import { WITH_DRAW, WIN_GOALS, DRAW_GOALS } from '../../config/settings';
import styles from './styles';
import S from '../../lib/strings';

export default class ScoreInput extends React.Component {
  state: {
    goals_home: ?string,
    goals_away: ?string,
    set: number,
  };
  onSave: Function;
  onPressBack: Function;

  constructor(props: any) {
    super(props);
    this.state = {
      goals_home: null,
      goals_away: null,
      set: 0,
    };

    this.onSave = this.onSave.bind(this);
    this.onPressBack = this.onPressBack.bind(this);
  }

  componentDidMount() {
    let idx = 0;
    const { sets } = this.props.data;

    for (let i = 0; i < sets.length - 1; i++) {
      if (sets[i].goals_home != null && sets[i].goals_away != null) {
        idx = i + 1;
      }
    }
    this.setState({
      set: idx,
    });
  }

  onSave() {
    this.props.onSave(this.props.data, {
      goals_home: parseInt(this.state.goals_home, 10),
      goals_away: parseInt(this.state.goals_away, 10),
      set: this.state.set,
    });
  }

  onPressBack() {
    this.setState({ set: this.state.set - 1 });
  }

  renderInput(key: string) {
    const otherKey: string = key === 'goals_away' ? 'goals_home' : 'goals_away';

    return (
      <TextInput
        keyboardType="numeric"
        value={this.state[key]}
        maxLength={1}
        keyboardAppearance="dark"
        selectionColor="#fff"
        underlineColorAndroid="#666"
        onChangeText={value => {
          const goals = parseInt(value, 10);
          this.setState({ [key]: value });
          if (!this.state[otherKey] && goals < WIN_GOALS) {
            this.setState(
              {
                [otherKey]:
                  WITH_DRAW && goals === DRAW_GOALS
                    ? `${DRAW_GOALS}`
                    : `${WIN_GOALS}`,
              },
              this.onSave,
            );
          }
        }}
        style={styles.input}
      />
    );
  }

  render() {
    const playerHome1 = this.props.data.sets
      ? this.props.data.sets[0].player_1_home
      : null;
    const playerAway1 = this.props.data.sets
      ? this.props.data.sets[0].player_1_away
      : null;
    const playerHome2 = this.props.data.sets
      ? this.props.data.sets[0].player_2_home
      : null;
    const playerAway2 = this.props.data.sets
      ? this.props.data.sets[0].player_2_away
      : null;
    return (
      <Card style={{ flex: 0 }}>
        <View style={styles.containerSet}>
          <Text bold secondary>{`${this.props.data.name} ${this.props.data.sets
            .length > 1
            ? `- ${S.RESULT} ${this.state.set + 1}${S.DOT_SET}`
            : `- ${S.RESULT}`}`}</Text>
        </View>
        <View style={styles.containerPlayers}>
          <View style={styles.containerPlayer}>
            {playerHome1 &&
              <Text center>
                {`${playerHome1.name} ${playerHome1.surname}`}
                {playerHome2 &&
                  `\n-\n${playerHome2.name} ${playerHome2.surname}`}
              </Text>}
          </View>
          <View style={styles.containerPlayer}>
            {playerAway1 &&
              <Text center>
                {`${playerAway1.name} ${playerAway1.surname}`}
                {playerAway2 &&
                  `\n-\n${playerAway2.name} ${playerAway2.surname}`}
              </Text>}
          </View>
        </View>
        <View style={styles.containerScore}>
          <View style={styles.score}>
            {this.renderInput('goals_home')}
          </View>
          <View style={styles.score}>
            {this.renderInput('goals_away')}
          </View>
        </View>
        <View style={styles.buttonRow}>
          <View style={styles.button}>
            {this.state.set > 0 &&
              <Touchable style={styles.buttonIcon} onPress={this.onPressBack}>
                <Icon name="arrow-back" size={20} style={styles.iconButton} />
                <Text style={styles.buttonText}>
                  {`${this.state.set}${Platform.OS === 'android'
                    ? S.DOT_SET.toUpperCase()
                    : S.DOT_SET}`}
                </Text>
              </Touchable>}
          </View>
          <View style={styles.vSeparator}>
            <Touchable style={styles.button} onPress={this.props.onCancel}>
              <Text style={styles.buttonText}>
                {Platform.OS === 'android' ? S.CANCEL.toUpperCase() : S.CANCEL}
              </Text>
            </Touchable>
          </View>
          {this.state.goals_home !== null &&
            this.state.goals_away !== null &&
            <Touchable onPress={this.onSave} style={styles.button}>
              <Text style={styles.buttonText}>
                {Platform.OS === 'android' ? S.SAVE.toUpperCase() : S.SAVE}
              </Text>
            </Touchable>}
          {(this.state.goals_home === null || this.state.goals_away === null) &&
            <View style={styles.buttonDisabled}>
              <Text style={styles.buttonText}>
                {Platform.OS === 'android' ? S.SAVE.toUpperCase() : S.SAVE}
              </Text>
            </View>}
        </View>
      </Card>
    );
  }
}
