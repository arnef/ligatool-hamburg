import React, { Component } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { Touchable, Text } from '../../components';
import Routes from '../../config/routes';

const white = 'rgba(255, 255, 255, .9)';

class MatchHeader extends Component {
  render() {
    const match = this.props.matches[this.props.matchId] || {};
    const home = match.team_home ? match.team_home.name : '';
    const away = match.team_away ? match.team_away.name : '';
    const goalsHome = match.goals_home != null ? match.goals_home : '-';
    const goalsAway = match.goals_away != null ? match.goals_away : '-';
    const scoreHome =
      match.set_points_home != null ? match.set_points_home : '-';
    const scoreAway =
      match.set_points_away != null ? match.set_points_away : '-';
    const goals = `${goalsHome}:${goalsAway}`;
    const score = `${scoreHome}:${scoreAway}`;

    const isAndroid = Platform.OS === 'android';

    return (
      <View style={[style.header, { backgroundColor: this.props.color }]}>
        <Touchable
          pressColor={white}
          borderless
          style={style.teamContainer}
          onPress={() => this.onPress(match.team_home)}
        >
          <Text
            center
            bold={isAndroid}
            color="#fff"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {home}
          </Text>
        </Touchable>
        <View style={style.score}>
          <Text style={style.points} color={this.props.color}>
            {score}
          </Text>
          <Text style={style.points} small color={this.props.color}>
            ({goals})
          </Text>
        </View>
        <Touchable
          pressColor={white}
          borderless
          style={style.teamContainer}
          onPress={() => this.onPress(match.team_away)}
        >
          <Text
            center
            bold={isAndroid}
            color="#fff"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {away}
          </Text>
        </Touchable>
      </View>
    );
  }

  onPress(team) {
    this.props.pushRoute({
      routeName: Routes.TEAM,
      params: { team, title: team.name },
    });
  }
}

const style = StyleSheet.create({
  header: {
    elevation: 4,
    flexDirection: 'row',
    height: 42,
    justifyContent: 'space-around',
    maxHeight: 42,
    shadowColor: 'black',
    shadowOffset: { height: StyleSheet.hairlineWidth },
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    zIndex: 999,
  },
  points: {
    alignItems: 'center',
    color: '#FFF',
    fontFamily: Platform.select({
      android: 'monospace',
      ios: 'Courier New',
    }),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  score: {
    alignItems: 'center',
    flex: 0,
    justifyContent: 'center',
  },
  teamContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
});

export default connect(
  state => ({
    color: state.settings.color,
    matches: state.matches,
  }),
  dispatch => ({
    pushRoute: route => dispatch(NavigationActions.navigate(route)),
  }),
)(MatchHeader);
