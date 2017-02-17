import React, { Component } from 'react';
import { View,	Text } from 'react-native';
import style from '../style';


class Score extends Component {

	renderScore() {
		const match = this.props.setPoints;
		
		return match.set_points ? `${match.set_points_home}:${match.set_points_away}` : '-:-';
	}

	render() {
		if (this.props.setPoints) {
			return (
				<View style={[style.score, { width: 58 }]}>
					<Text style={style.scoreText}>
						{ this.renderScore() }
					</Text>
				</View>
			);
		}
		else if (this.props.goals) {
			const set = this.props.goals;
			return (
				<View style={[style.score, { width: 48}]}>
					<Text style={style.scoreText}>
						{ ( set.goals_home != null ? set.goals_home : '-') + ':' + ( set.goals_away != null ? set.goals_away : '-') }
					</Text>
				</View>
			);
		}
		else {
			return (
				<View style={[style.score, { width: 48}]}>
					<Text style={style.scoreText}>
						-:-
					</Text>
				</View>
			);
		}
	}
}
export default Score;
