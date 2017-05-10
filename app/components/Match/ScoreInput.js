import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import { Row, Column, Touchable, Text } from '../../components/base';
import * as theme from '../../components/base/theme';

class ScoreInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      goals_away: null,
      goals_home: null,
      set: 0
    };
  }

  componentDidMount() {
    let idx = 0;
    const sets = this.props.data.sets;

    for (let i = 0; i < sets.length - 1; i++) {
      if (sets[i].goals_home != null && sets[i].goals_away != null) {
        idx = i + 1;
      }
    }
    this.setState({
      set: idx
    });
  }

  render() {
    const playerHome1 = this.props.data.sets
      ? this.props.data.sets[0].player_1_home
      : {};
    const playerAway1 = this.props.data.sets
      ? this.props.data.sets[0].player_1_away
      : {};
    const playerHome2 = this.props.data.sets
      ? this.props.data.sets[0].player_2_home
      : null;
    const playerAway2 = this.props.data.sets
      ? this.props.data.sets[0].player_2_away
      : null;

    return (
      <View>
        <Row center style={{ marginTop: 10 }}>
          <Column center>
            <Text center>
              {this.getName(playerHome1)}
              {playerHome2 && `\n-\n${this.getName(playerHome2)}`}
            </Text>
          </Column>
          <Column center>
            <Text center>
              {this.getName(playerAway1)}
              {playerAway2 && `\n-\n${this.getName(playerAway2)}`}
            </Text>
          </Column>
        </Row>
        <Row center style={{ marginBottom: 10 }}>
          <Column center>
            <View style={styles.score}>
              {this.renderInputField('goals_home')}
            </View>
          </Column>
          <Column center>
            <View style={styles.score}>
              {this.renderInputField('goals_away')}
            </View>
          </Column>
        </Row>
        <Row style={styles.buttonRow}>
          <Column>
            {this.state.set > 0 &&
              <Touchable onPress={this.goBack.bind(this)}>
                <Text
                  style={styles.buttonText}
                  upperCase={Platform.OS === 'android'}
                >
                  1. Satz
                </Text>
              </Touchable>}
          </Column>
          <Column style={styles.vSeparator}>
            <Touchable onPress={this.props.toggleMenu}>
              <Text
                style={styles.buttonText}
                upperCase={Platform.OS === 'android'}
              >
                Abbrechen
              </Text>
            </Touchable>
          </Column>
          <Column>
            <Touchable onPress={this.onSave.bind(this)}>
              <Text
                style={styles.buttonText}
                upperCase={Platform.OS === 'android'}
              >
                Speichern
              </Text>
            </Touchable>
          </Column>
        </Row>
      </View>
    );
  }

  renderInputField(key) {
    let otherKey = 'goals_away';

    if (key === 'goals_away') {
      otherKey = 'goals_home';
    }

    return (
      <TextInput
        keyboardType="numeric"
        value={this.state[key]}
        maxLength={1}
        ref={input => {
          this.inputField = input;
        }}
        keyboardAppearance="dark"
        selectionColor="#fff"
        underlineColorAndroid="#666"
        onFocus={this.onFocus.bind(this)}
        onChangeText={value => {
          const newState = {};
          const goals = parseInt(value, 10);

          newState[key] = value;
          this.setState(newState);
          if (!this.state[otherKey] && goals < 6) {
            newState[otherKey] = goals === 5 ? '5' : '6';
            this.setState(newState);
            setTimeout(this.onSave.bind(this), 50);
          }
        }}
        style={styles.input}
      />
    );
  }

  onFocus() {
    const input = this.inputField;

    input.measure((fx, fy, width, height, px, py) => {
      this.props.adjustPosition(py);
    });
  }

  onSave() {
    this.props.onSave(this.props.data, {
      goals_away: parseInt(this.state.goals_away, 10),
      goals_home: parseInt(this.state.goals_home, 10),
      set: this.state.set
    });
  }

  goBack() {
    this.setState({
      set: this.state.set - 1
    });
  }

  getName(player) {
    return !!player ? `${player.name} ${player.surname}` : '';
  }
}

const styles = StyleSheet.create({
  buttonRow: {
    borderTopColor: theme.backgroundColor,
    borderTopWidth: 1,
    paddingBottom: 0
  },
  buttonText: {
    color: theme.secondaryTextColor,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center'
  },
  input: Platform.select({
    android: {
      color: '#fff',
      fontFamily: 'monospace',
      fontSize: 24,
      padding: 6,
      textAlign: 'center'
    },
    ios: {
      color: '#fff',
      fontFamily: 'Courier New',
      fontSize: 24,
      fontWeight: 'bold',
      height: 30,
      margin: 8,
      textAlign: 'center'
    }
  }),
  score: {
    backgroundColor: '#666',
    borderRadius: 6,
    margin: 16,
    marginBottom: 0,
    marginTop: 10,
    width: 60
  },
  vSeparator: {
    borderLeftColor: theme.backgroundColor,
    borderLeftWidth: 1,
    borderRightColor: theme.backgroundColor,
    borderRightWidth: 1
  }
});

export default ScoreInput;
