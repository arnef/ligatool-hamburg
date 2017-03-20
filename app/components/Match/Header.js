import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Touchable, Text } from '../../components/base';
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

		const isAndroid = Platform.OS === 'android';

		return (
			<View style={[style.header, { backgroundColor: this.props.color}]}>
				<Touchable color='#fff' style={style.teamContainer}
					onPress={() => this.onPress(match.team_home) }>
					<Text center bold={isAndroid}  color='#fff' numberOfLines={2} ellipsizeMode='tail'>{home}</Text>
				</Touchable>
				<View style={style.score}>
					<Text style={style.points}>{score}</Text>
					<Text style={style.points} size={12}>({goals})</Text>
				</View>
				<Touchable color='#fff' style={style.teamContainer}
					onPress={() => this.onPress(match.team_away) }>
					<Text center bold={isAndroid}  color='#fff' numberOfLines={2} ellipsizeMode='tail'>{away}</Text>
				</Touchable>
			</View>
		)
	}

	onPress(team) {
		this.props.pushRoute({
			state: TEAM,
			team,
			title: team.name
		})
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
})

MatchHeader.propTypes = {
	pushRoute: PropTypes.func,
	data: PropTypes.object,
	color: PropTypes.string,
	navigator: PropTypes.object
}

export default connect( state => ({
	color: state.settings.color
}))(MatchHeader);
