import React, { Component } from 'react';
import { View } from 'react-native';
import formats from './formats';
import { connect } from 'react-redux';
import { Row, Column, Text, Switch, Content } from '../base';
import Set from './Set';
import Header from './Header';

class Match extends Component {
  renderRow(data, idx) {
    const {
      onPress,
      matches,
      editable,
      menuOpen,
      onSave,
      onSelect,
      adjustPosition,
      scoreInput,
      toggleMenu,
      toggleMatchType,
    } = this.props;
    const match = matches[this.props.match.id];
    const error =
      editable &&
      match.lineUp &&
      match.lineUp.errors.indexOf(data.setsIdx[0]) !== -1;
    return (
      <View key={idx}>
        {data.toggle &&
          editable &&
          <Content>
            <Row center>
              <Text>
                {data.toggle.title}
              </Text>
              <Column />
              <Switch
                onValueChange={() => {
                  toggleMatchType(match.id, data.setsIdx, data.toggle.type);
                }}
                value={match.type.indexOf('d5') !== -1}
              />
            </Row>
          </Content>}
        <Set
          onPress={
            onPress
              ? () => {
                  onPress(data, idx);
                }
              : null
          }
          openPlayer={this.props.openPlayer}
          editable={editable}
          error={error}
          index={idx}
          toggleMenu={
            editable
              ? () => {
                  toggleMenu(idx);
                }
              : null
          }
          menuOpen={menuOpen === idx}
          onSelect={onSelect}
          onSave={onSave}
          adjustPosition={adjustPosition}
          scoreInput={scoreInput === idx}
          data={data}
        />
      </View>
    );
  }

  getName(data, key) {
    return data[key]
      ? `${data[key].name} ${data[key].surname}`
      : this.props.editable ? 'Bitte wählen' : '';
  }

  buildMatchData() {
    const id = this.props.match.id;
    const matches = this.props.matches;
    const editMatch = this.props.editable;
    const match = matches[id] && matches[id].sets ? matches[id] : { sets: [] };
    const sets = [];
    const format = formats[match.type || 'default'];

    for (let set of format) {
      const data = { ...set };

      data.sets = [];
      for (let setIdx of data.setsIdx) {
        if (match.sets[setIdx]) {
          data.sets.push(match.sets[setIdx]);
        } else if (editMatch) {
          if (
            !data.extra ||
            (data.extra &&
              match.set_points_home >= 16 &&
              match.set_points_away >= 16)
          ) {
            data.sets.push({});
          }
        }
      }
      if (data.sets.length > 0) {
        sets.push(data);
      }
    }

    return sets;
  }

  render() {
    const sets = this.buildMatchData();

    return (
      <View>
        {sets.map((set, idx) => {
          return this.renderRow(set, idx, idx < sets.length - 1);
        })}
      </View>
    );
  }
}

Match.Header = Header;

export default connect(state => ({
  loading: state.loading.nonBlocking,
  color: state.settings.color,
  matches: state.matches,
}))(Match);
