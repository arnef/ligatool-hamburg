import React from 'react';
import { View, TextInput, Platform } from 'react-native';
import Card from '../Card';
import Touchable from '../Touchable';
import Text from '../Text';
import Icon from '../Icon';
import styles from './styles';
import S from '../../lib/strings';

export default class ScoreInput extends React.Component {
  constructor(props) {
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
    const { gameNumbers } = this.props.data;

    for (let i = 0; i < gameNumbers.length - 1; i++) {
      const set = this.props.getSet(gameNumbers[i]);
      if (set.result) {
        idx = i + 1;
      }
    }
    this.setState({
      set: idx,
    });
  }

  onSave() {
    this.props.onSave(this.props.data, {
      goalsHome: parseInt(this.state.goals_home, 10),
      goalsAway: parseInt(this.state.goals_away, 10),
      gameNumber: this.props.data.gameNumbers[this.state.set],
    });
  }

  onPressBack() {
    this.setState({ set: this.state.set - 1 });
  }

  onTextChange(value, key, otherKey) {
    const { type } = this.props.data;
    const { doubles, singles } = this.props.modus;
    const winGoals = Math.abs(type === 'DOUBLES' ? doubles : singles);
    const withDraw = (type === 'DOUBLES' ? doubles : singles) < 0;
    const goals = parseInt(value, 10);
    this.setState({ [key]: value });
    if (!this.state[otherKey] && goals == 2 && winGoals == 2) {
      this.setState(
        {
          [otherKey]: `0`,
        },
        this.onSave,
      );
    } else if (!this.state[otherKey] && goals < winGoals) {
      this.setState(
        {
          [otherKey]:
            withDraw && goals === winGoals - 1
              ? `${winGoals - 1}`
              : `${winGoals}`,
        },
        this.onSave,
      );
    }
  }

  renderInput(key) {
    const otherKey = key === 'goals_away' ? 'goals_home' : 'goals_away';

    return (
      <TextInput
        keyboardType="numeric"
        value={this.state[key]}
        maxLength={1}
        keyboardAppearance="dark"
        selectionColor="#fff"
        underlineColorAndroid="#666"
        onChangeText={value => this.onTextChange(value, key, otherKey)}
        style={styles.input}
      />
    );
  }

  render() {
    const { getSet, data } = this.props;
    const playerHome1 = getSet(data.gameNumbers[0]).homePlayer1;
    const playerAway1 = getSet(data.gameNumbers[0]).awayPlayer1;
    const playerHome2 = getSet(data.gameNumbers[0]).homePlayer2;
    const playerAway2 = getSet(data.gameNumbers[0]).awayPlayer2;
    return (
      <Card style={{ flex: 0 }}>
        <View style={styles.containerSet}>
          <Text bold secondary>{`${this.props.data.name} ${this.props.data
            .gameNumbers.length > 1
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
