import React, { Component } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { connect } from 'react-redux';
import Touchable from '../Touchable';
import { TEAM } from '../../views/routes';

class MatchHeader extends Component {

	render() {
        const match = this.props.data;
		const home = match.team_home ? match.team_home.name : '';
		const away = match.team_away ? match.team_away.name : '';
		const goals_home = match.goals_home != null ? match.goals_home : '-';
		const goals_away = match.goals_away != null ? match.goals_away : '-';
		const score_home = match.set_points_home != null ? match.set_points_home : '-';
		const score_away = match.set_points_away != null ? match.set_points_away : '-';
		const goals = `${goals_home}:${goals_away}`;
		const score = `${score_home}:${score_away}`;


		return (
			<View style={[style.header, { backgroundColor: this.props.color}]}>
				<Touchable style={style.teamContainer}
					onPress={() => { this.props.navigator.push({ state: TEAM, team: match.team_home, title: match.team_home.name })}}>
					<Text style={style.team} numberOfLines={2} ellipsizeMode='tail'>{home}</Text>
				</Touchable>
				<View style={style.score}>
					<Text style={style.points}>{score}</Text>
					<Text style={style.goals}>({goals})</Text>
				</View>
				<Touchable style={style.teamContainer}
					onPress={() => { this.props.navigator.push({ state: TEAM, team: match.team_away, title: match.team_away.name })}}>
					<Text style={style.team} numberOfLines={2} ellipsizeMode='tail'>{away}</Text>
				</Touchable>
			</View>
		);
	}
}

const style = StyleSheet.create({
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 46,
		maxHeight: 46,
		backgroundColor: '#666'
	},
	score: {
        alignItems: 'center',
		flex: 1
	},
	teamContainer: {
		padding: 8,
		flex: 2
	},
	team: {
		textAlign: 'center',
		color: '#FFF',
		marginHorizontal: 4
	},
	points: {
		fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
		color: '#FFF',
		fontWeight: 'bold',
		textAlign: 'center',
        alignItems: 'center'
	},
	goals: {
		fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
		color: '#FFF',
		textAlign: 'center',
        alignItems: 'center',
		fontSize: 12
	}
});

export default connect( state => ({
	color: state.settings.color
}))(MatchHeader);
