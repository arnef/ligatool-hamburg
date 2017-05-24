import React, { Component } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text } from './base';
class Score extends Component {
  renderScore() {
    const match = this.props.setPoints;

    return match.set_points
      ? `${match.set_points_home}:${match.set_points_away}`
      : '-:-';
  }

  render() {
    if (this.props.setPoints) {
      return (
        <View>
        <View style={[styles.score, { marginTop: 8 }]}>
          <Text style={styles.scoreText}>
            {this.renderScore()}
          </Text>
        </View>
        <Text
          bold
          center
          small
          style={{marginTop: 2}}
          color={this.props.setPoints.live ? '#555' : 'transparent'}
        >
          LIVE
        </Text>
        </View>
      );
    } else if (this.props.goals) {
      const set = this.props.goals;

      return (
        <View style={{ borderWidth: 0 }}>
          <View style={[styles.score, { width: 48 }, this.props.style]}>
            <Text style={styles.scoreText}>
              {(set.goals_home != null ? set.goals_home : '-') +
                ':' +
                (set.goals_away != null ? set.goals_away : '-')}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={[styles.score, { width: 48 }, this.props.style]}>
          <Text style={styles.scoreText}>
            -:-
          </Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  score: {
    backgroundColor: '#555',
    borderRadius: 2,
    marginHorizontal: 4,
    padding: 6,
    width: 56
  },
  scoreText: {
    color: '#FFF',
    fontFamily: Platform.select({
      android: 'monospace',
      ios: 'Courier New'
    }),
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default Score;
