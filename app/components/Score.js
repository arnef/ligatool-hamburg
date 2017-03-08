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
				<View style={[style.score, { width: 58 }, this.props.style]}>
					<Text style={style.scoreText}>
						{ this.renderScore() }
					</Text>
				</View>
			);
		}
		else if (this.props.goals) {
			const set = this.props.goals;
			return (
				<View style={{borderWidth: 0}}>
				<View style={[style.score, { width: 48}, this.props.style]}>
					<Text style={style.scoreText}>
						{ ( set.goals_home != null ? set.goals_home : '-') + ':' + ( set.goals_away != null ? set.goals_away : '-') }
					</Text>
				</View>
				</View>
			);
		}
		else {
			return (
				<View style={[style.score, { width: 48}, this.props.style]}>
					<Text style={style.scoreText}>
						-:-
					</Text>
				</View>
			);
		}
	}
}
export default Score;
