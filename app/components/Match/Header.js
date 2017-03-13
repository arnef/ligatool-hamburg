import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Touchable, Text } from '../../ui';
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
				<Touchable color='#fff' style={style.teamContainer}
					onPress={() => { this.props.navigator.push({ state: TEAM, team: match.team_home, title: match.team_home.name })}}>
					<Text center bold  color='#fff' numberOfLines={2} ellipsizeMode='tail'>{home}</Text>
				</Touchable>
				<View style={style.score}>
					<Text style={style.points}>{score}</Text>
					<Text style={style.points} size={12}>({goals})</Text>
				</View>
				<Touchable color='#fff' style={style.teamContainer}
					onPress={() => { this.props.navigator.push({ state: TEAM, team: match.team_away, title: match.team_away.name })}}>
					<Text center bold  color='#fff' numberOfLines={2} ellipsizeMode='tail'>{away}</Text>
				</Touchable>
			</View>
		);
	}
}

const style = StyleSheet.create({
	header: {
		height: 46,
		maxHeight: 46,
		flexDirection: 'row',		
		justifyContent: 'space-around'
	},
	score: {
        alignItems: 'center',
		justifyContent: 'center',
		flex: 0
	},
	teamContainer: {
		flex: 1,
		paddingHorizontal: 4,
		alignItems: 'center',
		justifyContent: 'center'
	},
	points: {
		fontFamily: Platform.select({
			ios: 'Courier New',
			android: 'monospace'
		}),
		color: '#FFF',
		fontWeight: 'bold',
		textAlign: 'center',
        alignItems: 'center'
	}
});

MatchHeader.propTypes = {
	data: PropTypes.object,
	color: PropTypes.string,
	navigator: PropTypes.object
};

export default connect( state => ({
	color: state.settings.color
}))(MatchHeader);
