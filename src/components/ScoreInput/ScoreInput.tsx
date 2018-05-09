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

import { Icon, Text, Touchable } from '@app/components';
import { IS_ANDROID } from '@app/consts';
import { Strings } from '@app/lib/strings';
import * as React from 'react';
import { TextInput, View } from 'react-native';

import styles from './styles';

interface IProps {
  data: any;
  modus: any;
  getSet: (gameNumber: string) => any;
  onSave: (data: any, result: any) => void;
  onCancel: () => void;
}

interface IState {
  goalsHome?: string;
  goalsAway?: string;
  set: number;
}

export default class ScoreInput extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      goalsAway: null,
      goalsHome: null,
      set: 0,
    };

    this.onPressBack = this.onPressBack.bind(this);
  }

  public componentDidMount(): void {
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

  public onSave = (): void => {
    this.props.onSave(this.props.data, {
      gameNumber: this.props.data.gameNumbers[this.state.set],
      goalsAway: parseInt(this.state.goalsAway, 10),
      goalsHome: parseInt(this.state.goalsHome, 10),
    });
  };

  public onPressBack = (): void => {
    this.setState({ set: this.state.set - 1 });
  };

  public onTextChange = (
    key: 'goalsHome' | 'goalsAway',
    otherKey: 'goalsHome' | 'goalsAway',
  ) => (value: string): void => {
    const { type } = this.props.data;
    const { doubles, singles } = this.props.modus;
    const winGoals = Math.abs(type === 'DOUBLES' ? doubles : singles);
    const withDraw = (type === 'DOUBLES' ? doubles : singles) < 0;
    const goals = parseInt(value, 10);
    this.setState<'goalsHome' | 'goalsAway'>({ [key]: value });

    if (!this.state[otherKey] && goals === 2 && winGoals === 2) {
      this.setState<'goalsHome' | 'goalsAway'>(
        {
          [otherKey]: `0`,
        },
        this.onSave,
      );
    } else if (!this.state[otherKey] && goals < winGoals) {
      this.setState<'goalsHome' | 'goalsAway'>(
        {
          [otherKey]:
            withDraw && goals === winGoals - 1
              ? `${winGoals - 1}`
              : `${winGoals}`,
        },
        this.onSave,
      );
    }
  };

  public renderInput(key: 'goalsHome' | 'goalsAway') {
    const otherKey: 'goalsHome' | 'goalsAway' =
      key === 'goalsAway' ? 'goalsHome' : 'goalsAway';

    return (
      <TextInput
        keyboardType="numeric"
        value={this.state[key]}
        maxLength={1}
        keyboardAppearance="dark"
        selectionColor="#fff"
        underlineColorAndroid="#666"
        onChangeText={this.onTextChange(key, otherKey)}
        style={styles.input}
      />
    );
  }

  public render() {
    const { getSet, data } = this.props;

    const playerHome1 = getSet(data.gameNumbers[0]).homePlayer1;
    const playerAway1 = getSet(data.gameNumbers[0]).awayPlayer1;
    const playerHome2 = getSet(data.gameNumbers[0]).homePlayer2;
    const playerAway2 = getSet(data.gameNumbers[0]).awayPlayer2;
    return (
      <View>
        <View style={styles.containerSet}>
          <Text bold secondary>{`${this.props.data.name} ${
            this.props.data.gameNumbers.length > 1
              ? `- ${Strings.RESULT} ${this.state.set + 1}${Strings.DOT_SET}`
              : `- ${Strings.RESULT}`
          }`}</Text>
        </View>
        <View style={styles.containerPlayers}>
          <View style={styles.containerPlayer}>
            {playerHome1 && (
              <Text center>
                {`${playerHome1.name} ${playerHome1.surname}`}
                {playerHome2 &&
                  `\n-\n${playerHome2.name} ${playerHome2.surname}`}
              </Text>
            )}
          </View>
          <View style={styles.containerPlayer}>
            {playerAway1 && (
              <Text center>
                {`${playerAway1.name} ${playerAway1.surname}`}
                {playerAway2 &&
                  `\n-\n${playerAway2.name} ${playerAway2.surname}`}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.containerScore}>
          <View style={styles.score}>{this.renderInput('goalsHome')}</View>
          <View style={styles.score}>{this.renderInput('goalsAway')}</View>
        </View>
        <View style={styles.buttonRow}>
          <View style={styles.button}>
            {this.state.set > 0 && (
              <Touchable style={styles.buttonIcon} onPress={this.onPressBack}>
                <Icon name="arrow-back" size={20} style={styles.iconButton} />
                <Text style={styles.buttonText}>
                  {`${this.state.set}${
                    IS_ANDROID ? Strings.DOT_SET.toUpperCase() : Strings.DOT_SET
                  }`}
                </Text>
              </Touchable>
            )}
          </View>
          <View style={styles.vSeparator}>
            <Touchable style={styles.button} onPress={this.props.onCancel}>
              <Text style={styles.buttonText}>
                {IS_ANDROID ? Strings.CANCEL.toUpperCase() : Strings.CANCEL}
              </Text>
            </Touchable>
          </View>
          {this.state.goalsHome !== null &&
            this.state.goalsAway !== null && (
              <Touchable onPress={this.onSave} style={styles.button}>
                <Text style={styles.buttonText}>
                  {IS_ANDROID ? Strings.SAVE.toUpperCase() : Strings.SAVE}
                </Text>
              </Touchable>
            )}
          {(this.state.goalsHome === null || this.state.goalsAway === null) && (
            <View style={styles.buttonDisabled}>
              <Text style={styles.buttonText}>
                {IS_ANDROID ? Strings.SAVE.toUpperCase() : Strings.SAVE}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}
